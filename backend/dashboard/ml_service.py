import os
import pickle
import pandas as pd
import numpy as np
import json
import urllib.request
import urllib.parse
from datetime import datetime, timedelta

# Load Model
APP_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(APP_DIR, 'bouclier_model.pkl')
FEATURES_PATH = os.path.join(APP_DIR, 'features.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(FEATURES_PATH, 'rb') as f:
        features_list = pickle.load(f)
except Exception as e:
    model = None
    features_list = []
    print(f"Error loading model: {e}")

# Fallback Coordinates mapping (only used if Geocoding API completely fails)
PROVINCE_COORDS = {
    "Oujda": {"lat": 34.68, "lng": -1.91},
    "Jerada": {"lat": 34.31, "lng": -2.16},
    "Figuig": {"lat": 32.11, "lng": -1.23},
    "Bouarfa": {"lat": 32.52, "lng": -1.95},
    "Ain Beni Mathar": {"lat": 34.0, "lng": -2.05},
    "Nador": {"lat": 35.16, "lng": -2.93},
    "Berkane": {"lat": 34.92, "lng": -2.32},
    "Taourirt": {"lat": 34.40, "lng": -2.89},
}

def get_coordinates_from_province(province: str):
    """
    Dynamically fetches the exact coordinates of the enterprise's province
    using Open-Meteo's free Geocoding API to ensure absolute regional accuracy.
    """
    # Clean up the name for better search results (e.g. "Oujda-Angad" -> "Oujda")
    search_term = province.split('-')[0].split(' ')[0] if province else "Oujda"
    safe_name = urllib.parse.quote(search_term)
    
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={safe_name}&count=1&language=fr"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get('results') and len(data['results']) > 0:
                result = data['results'][0]
                return {"lat": result["latitude"], "lng": result["longitude"]}
    except Exception as e:
        print(f"Geocoding Error for {province}: {e}")
    
    # Check if we have an explicit fallback
    for key, value in PROVINCE_COORDS.items():
        if key.lower() in str(province).lower():
            return value
            
    # Absolute fallback to Oujda
    return {"lat": 34.68, "lng": -1.91}

# Regional sites mapping (for map context)
SOLAR_SITES = [
    {"id": "abm", "name": "Ain Beni Mathar", "province": "Ain Beni Mathar", "lat": 34.0, "lng": -2.05, "capacityMW": 472, "base_efficiency": 85},
    {"id": "bouarfa", "name": "Bouarfa", "province": "Bouarfa", "lat": 32.52, "lng": -1.95, "capacityMW": 320, "base_efficiency": 82},
    {"id": "jerada", "name": "Jerada", "province": "Jerada", "lat": 34.31, "lng": -2.16, "capacityMW": 185, "base_efficiency": 88},
    {"id": "figuig", "name": "Figuig", "province": "Figuig", "lat": 32.11, "lng": -1.23, "capacityMW": 250, "base_efficiency": 80},
    {"id": "oujda", "name": "Oujda Solar Park", "province": "Oujda", "lat": 34.68, "lng": -1.91, "capacityMW": 210, "base_efficiency": 89},
    {"id": "tendrara", "name": "Tendrara", "province": "Jerada", "lat": 33.05, "lng": -2.02, "capacityMW": 150, "base_efficiency": 81},
]

def get_base_efficiency(installation_type: str) -> int:
    """Returns baseline efficiency based on technology."""
    mapping = {
        'csp': 85,
        'bifacial': 92,
        'monofacial': 82,
        'hybrid': 88,
    }
    return mapping.get(installation_type, 85)

def get_real_weather_forecast(lat: float, lng: float):
    """
    Fetch a 7-day weather forecast from Open-Meteo API.
    Returns a dictionary with 'current' and 'daily' data.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration&timezone=auto"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            return {
                'current': data.get('current', {}),
                'daily': data.get('daily', {})
            }
    except Exception as e:
        print(f"Error fetching from Open-Meteo: {e}")
        return {'current': {}, 'daily': {}}

def generate_features_from_weather(date_offset_days, weather_data):
    """
    Generate realistic meteorological data for a given day (offset from today),
    combining real Open-Meteo weather with simulated dust for the ML model.
    """
    target_date = datetime.now() + timedelta(days=date_offset_days)
    day_of_year = target_date.timetuple().tm_yday
    month = target_date.month

    # Extract real weather if available, otherwise fallback to reasonable defaults
    try:
        # If today (offset 0), use the exact current conditions instead of the daily maximums
        if date_offset_days == 0 and 'temperature_2m' in weather_data['current']:
            real_tmax = weather_data['current']['temperature_2m']
            real_wind_max = weather_data['current']['wind_speed_10m']
            real_wind_dir = weather_data['current']['wind_direction_10m']
        else:
            real_tmax = weather_data['daily']['temperature_2m_max'][date_offset_days]
            real_wind_max = weather_data['daily']['wind_speed_10m_max'][date_offset_days]
            real_wind_dir = weather_data['daily']['wind_direction_10m_dominant'][date_offset_days]
            
        real_tmin = weather_data['daily']['temperature_2m_min'][date_offset_days]
        real_precip = weather_data['daily']['precipitation_sum'][date_offset_days]
        real_et0 = weather_data['daily']['et0_fao_evapotranspiration'][date_offset_days]
    except Exception:
        # Fallbacks in case API fails
        real_tmax = 25
        real_tmin = 15
        real_wind_max = 20
        real_wind_dir = 270
        real_precip = 0
        real_et0 = 4

    # Determine Chergui condition based on real wind direction (East/South-East ~ 90-180 deg) and speed
    is_chergui = 1 if (90 <= real_wind_dir <= 180) and real_wind_max > 30 else 0
    
    # Simulate dust (since Open-Meteo free tier doesn't provide PM10/Dust easily without Air Quality API)
    # If Chergui or high wind, dust spikes
    dust_base = 300 if is_chergui else 50
    dust_mean = max(10, dust_base + (real_wind_max * 1.5))
    dust_max = dust_mean * 1.5
    
    pm10 = dust_mean * 0.8
    pm25 = dust_mean * 0.3

    features = {
        'dust_mean_ug_m3': dust_mean,
        'dust_max_ug_m3': dust_max,
        'pm10_mean_ug_m3': pm10,
        'pm25_mean_ug_m3': pm25,
        'vent_max_kmh': real_wind_max,
        'vent_direction_deg': real_wind_dir,
        'pluie_mm': real_precip,
        'radiation_norm_0_1': np.clip(0.8 - (real_precip * 0.05), 0, 1),
        'temp_max_C': real_tmax,
        'temp_min_C': real_tmin,
        'evapotranspiration_mm': real_et0,
        'days_since_rain': 0 if real_precip > 1 else (15 + date_offset_days),
        'is_chergui': is_chergui,
        'dust_lag1': max(10, dust_mean - 20),
        'dust_lag2': max(10, dust_mean - 40),
        'dust_lag3': max(10, dust_mean - 60),
        'pluie_lag1': 0,
        'pluie_lag2': 0,
        'pluie_lag3': 0,
        'dust_roll7': (dust_mean + 50) / 2,
        'pluie_roll7': real_precip / 7,
        'dust_x_vent': dust_mean * real_wind_max,
        'month_sin': np.sin(2 * np.pi * month / 12),
        'month_cos': np.cos(2 * np.pi * month / 12),
        'doy_sin': np.sin(2 * np.pi * day_of_year / 365.25),
        'doy_cos': np.cos(2 * np.pi * day_of_year / 365.25),
    }

    # Ensure exact order as features.pkl
    return pd.DataFrame([features], columns=features_list)

def get_dashboard_data(enterprise):
    """Run model for today + next 6 days for the specific authenticated enterprise."""
    if not model:
        return {"error": "Model not loaded"}

    # 0. Get Real Weather Data from Open-Meteo
    coords = get_coordinates_from_province(enterprise.province)
    weather_data = get_real_weather_forecast(coords["lat"], coords["lng"])

    # 1. Generate 7-day timeline forecasts
    forecasts = []
    for day_offset in range(7):
        X = generate_features_from_weather(day_offset, weather_data)
        # Assuming model predicts dust_mean_ug_m3 for the target day
        pred_dust = model.predict(X)[0]
        
        # Convert raw dust (ug/m3) to a 0-100 severity index for UI
        dust_prob = min(100, max(0, int((pred_dust / 500) * 100))) 
        wind_speed = int(X['vent_max_kmh'].iloc[0])
        
        # Energy impact formula: higher dust + higher wind = worse impact
        impact = min(0, -int((dust_prob * 0.4) + (wind_speed * 0.2)))
        
        vis = "Good"
        if dust_prob > 80: vis = "Critical"
        elif dust_prob > 60: vis = "Very Low"
        elif dust_prob > 40: vis = "Low"
        elif dust_prob > 20: vis = "Moderate"

        target_date = datetime.now() + timedelta(days=day_offset)
        
        forecasts.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "day": "Today" if day_offset == 0 else target_date.strftime("%a"),
            "windSpeedKmh": wind_speed,
            "dustProbability": dust_prob,
            "energyImpactPercent": impact,
            "temperature": int(X['temp_max_C'].iloc[0]),
            "visibility": vis,
            "precipMm": round(float(X['pluie_mm'].iloc[0]), 1)
        })

    # 2. Get today's prediction for site-level application
    today_dust_prob = forecasts[0]['dustProbability']
    
    # 3. Generate Site Data specifically for the logged in Enterprise
    base_efficiency = get_base_efficiency(enterprise.installation_type)
    
    # ML predicted local dust
    local_dust = max(0, min(100, int(today_dust_prob * np.random.uniform(0.9, 1.1))))
    
    # Drop efficiency based on dust severity
    efficiency = base_efficiency - (local_dust * 0.3)
    current_output = int(enterprise.capacity * (efficiency / 100))
    
    status = "operational"
    if local_dust > 75: status = "critical"
    elif local_dust > 50: status = "warning"
    
    # MAD loss calculation: 1 MW lost = ~1000 MAD/day
    yield_loss = int((enterprise.capacity - current_output) * 1000)
    
    next_cleaning = (datetime.now() + timedelta(days=int(max(1, (100-local_dust)/10)))).strftime("%Y-%m-%d 06:00")
    
    sites_data = [{
        "id": str(enterprise.id),
        "name": enterprise.company_name,
        "lat": coords["lat"],
        "lng": coords["lng"],
        "capacityMW": enterprise.capacity,
        "currentOutputMW": current_output,
        "dustLevel": local_dust,
        "status": status,
        "nextCleaning": next_cleaning,
        "yieldLossMAD": yield_loss,
        "efficiency": round(efficiency, 1),
        "is_owned": True
    }]
    
    # Add regional context sites (excluding the province the enterprise is in to avoid direct overlap if possible, or just keep them)
    # This provides the map with a full grid layout.
    for site in SOLAR_SITES:
        if site['province'] != enterprise.province:
            # Generate generic stats for regional sites
            reg_dust = max(0, min(100, int(today_dust_prob * np.random.uniform(0.85, 1.15))))
            reg_eff = site['base_efficiency'] - (reg_dust * 0.3)
            reg_output = int(site['capacityMW'] * (reg_eff / 100))
            
            reg_status = "operational"
            if reg_dust > 75: reg_status = "critical"
            elif reg_dust > 50: reg_status = "warning"
            
            sites_data.append({
                "id": site['id'],
                "name": site['name'],
                "lat": site['lat'],
                "lng": site['lng'],
                "capacityMW": site['capacityMW'],
                "currentOutputMW": reg_output,
                "dustLevel": reg_dust,
                "status": reg_status,
                "nextCleaning": next_cleaning,
                "yieldLossMAD": int((site['capacityMW'] - reg_output) * 1000),
                "efficiency": round(reg_eff, 1),
                "is_owned": False
            })

    # 4. KPI Data (Now scoped only to this single enterprise)
    kpi_data = {
        "totalOutputMW": current_output,
        "totalOutputChange": -int(today_dust_prob * 0.05),
        "cleaningEfficiency": round(efficiency, 1),
        "cleaningEfficiencyChange": -2.1 if today_dust_prob > 50 else 1.5,
        "activeAlerts": 1 if status in ['warning', 'critical'] else 0,
        "alertsChange": 1 if today_dust_prob > 50 else 0,
        "costSavingsMAD": int(yield_loss * 1.5), # Assuming AI saves 1.5x what is lost

        "costSavingsChange": 12.5,
    }

    # 5. Generate AI Alerts based on the 7-day forecast
    alerts = []
    
    # Check for Storms
    storm_day = next((f for f in forecasts if f['dustProbability'] > 60), None)
    if storm_day:
        alerts.append({
            "id": "alert_storm",
            "type": "warning",
            "title": "Alerte Tempête Chergui",
            "message": f"Une tempête de poussière est prévue pour {storm_day['day']} ({storm_day['date']}). Sauvegardez l'énergie dans vos batteries ou réduisez votre consommation.",
            "date": datetime.now().strftime("%Y-%m-%d %H:%M")
        })
        
        # Find best day to clean (first calm day *after* the storm)
        calm_days_after = [f for f in forecasts if f['date'] > storm_day['date'] and f['dustProbability'] < 40 and f['windSpeedKmh'] < 30]
        if calm_days_after:
            best_clean_day = calm_days_after[0]
            alerts.append({
                "id": "alert_cleaning",
                "type": "info",
                "title": "Recommandation de Nettoyage",
                "message": f"Le jour optimal pour nettoyer vos panneaux est le {best_clean_day['day']} ({best_clean_day['date']}) après la dissipation de la tempête.",
                "date": datetime.now().strftime("%Y-%m-%d %H:%M")
            })

    return {
        "forecasts": forecasts,
        "sites": sites_data,
        "kpi": kpi_data,
        "alerts": alerts
    }
