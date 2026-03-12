import os
import pickle
import pandas as pd
import numpy as np
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

# Solar Sites Configuration
SOLAR_SITES = [
    {"id": "abm", "name": "Ain Beni Mathar", "capacityMW": 472, "base_efficiency": 85},
    {"id": "bouarfa", "name": "Bouarfa", "capacityMW": 320, "base_efficiency": 82},
    {"id": "jerada", "name": "Jerada", "capacityMW": 185, "base_efficiency": 88},
    {"id": "figuig", "name": "Figuig", "capacityMW": 250, "base_efficiency": 80},
    {"id": "oujda", "name": "Oujda Solar Park", "capacityMW": 210, "base_efficiency": 89},
    {"id": "tendrara", "name": "Tendrara", "capacityMW": 150, "base_efficiency": 81},
]

def generate_mock_features(date_offset_days=0):
    """
    Generate realistic mock meteorological data for a given day (offset from today).
    Creates the exact 26 features expected by the model.
    """
    target_date = datetime.now() + timedelta(days=date_offset_days)
    day_of_year = target_date.timetuple().tm_yday
    month = target_date.month

    # Simulate a Chergui event peaking at day_offset == 2
    is_chergui = 1 if 1 <= date_offset_days <= 3 else 0
    wind_base = 60 if is_chergui else 20
    wind_max = wind_base + np.random.normal(0, 10)
    
    dust_base = 300 if is_chergui else 50
    dust_mean = max(10, dust_base + np.random.normal(0, 50))
    dust_max = dust_mean * 1.5
    
    pm10 = dust_mean * 0.8
    pm25 = dust_mean * 0.3

    features = {
        'dust_mean_ug_m3': dust_mean,
        'dust_max_ug_m3': dust_max,
        'pm10_mean_ug_m3': pm10,
        'pm25_mean_ug_m3': pm25,
        'vent_max_kmh': wind_max,
        'vent_direction_deg': 120 + np.random.normal(0, 20) if is_chergui else 270,
        'pluie_mm': 0,
        'radiation_norm_0_1': np.clip(0.8 + np.random.normal(0, 0.1), 0, 1),
        'temp_max_C': 35 if is_chergui else 28,
        'temp_min_C': 20,
        'evapotranspiration_mm': 7 if is_chergui else 4,
        'days_since_rain': 15 + date_offset_days,
        'is_chergui': is_chergui,
        'dust_lag1': max(10, dust_mean - 20),
        'dust_lag2': max(10, dust_mean - 40),
        'dust_lag3': max(10, dust_mean - 60),
        'pluie_lag1': 0,
        'pluie_lag2': 0,
        'pluie_lag3': 0,
        'dust_roll7': (dust_mean + 50) / 2,
        'pluie_roll7': 0,
        'dust_x_vent': dust_mean * wind_max,
        'month_sin': np.sin(2 * np.pi * month / 12),
        'month_cos': np.cos(2 * np.pi * month / 12),
        'doy_sin': np.sin(2 * np.pi * day_of_year / 365.25),
        'doy_cos': np.cos(2 * np.pi * day_of_year / 365.25),
    }

    # Ensure exact order as features.pkl
    return pd.DataFrame([features], columns=features_list)

def get_dashboard_data():
    """Run model for today + next 6 days and format data for React Dashboard."""
    if not model:
        return {"error": "Model not loaded"}

    # 1. Generate 7-day timeline forecasts
    forecasts = []
    for day_offset in range(7):
        X = generate_mock_features(day_offset)
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
            "visibility": vis
        })

    # 2. Get today's prediction for site-level application
    today_dust_prob = forecasts[0]['dustProbability']
    
    # 3. Generate Site Data (apply regional dust to individual sites with slight variations)
    sites_data = []
    total_output = 0
    total_loss_mad = 0
    
    for site in SOLAR_SITES:
        # Add slight local variation (-15% to +15% of regional dust)
        local_dust = max(0, min(100, int(today_dust_prob * np.random.uniform(0.85, 1.15))))
        
        efficiency = site['base_efficiency'] - (local_dust * 0.3)
        current_output = int(site['capacityMW'] * (efficiency / 100))
        total_output += current_output
        
        status = "operational"
        if local_dust > 75: status = "critical"
        elif local_dust > 50: status = "warning"
        
        # MAD loss calculation: 1 MW = ~1000 MAD/day
        yield_loss = int((site['capacityMW'] - current_output) * 1000)
        total_loss_mad += yield_loss
        
        next_cleaning = (datetime.now() + timedelta(days=int(max(1, (100-local_dust)/10)))).strftime("%Y-%m-%d 06:00")
        
        sites_data.append({
            "id": site['id'],
            "name": site['name'],
            "capacityMW": site['capacityMW'],
            "currentOutputMW": current_output,
            "dustLevel": local_dust,
            "status": status,
            "nextCleaning": next_cleaning,
            "yieldLossMAD": yield_loss,
            "efficiency": round(efficiency, 1)
        })

    # 4. KPI Data
    kpi_data = {
        "totalOutputMW": total_output,
        "totalOutputChange": -today_dust_prob * 0.1,  # Mock trend
        "cleaningEfficiency": round(np.mean([s['efficiency'] for s in sites_data]), 1),
        "cleaningEfficiencyChange": -2.1 if today_dust_prob > 50 else 1.5,
        "activeAlerts": len([s for s in sites_data if s['status'] in ['warning', 'critical']]),
        "alertsChange": 2 if today_dust_prob > 50 else -1,
        "costSavingsMAD": int(total_loss_mad * 1.5), # Assuming AI saves 1.5x what is lost
        "costSavingsChange": 12.5,
    }

    return {
        "forecasts": forecasts,
        "sites": sites_data,
        "kpi": kpi_data
    }
