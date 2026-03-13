import json
import urllib.request
import urllib.parse
from celery import shared_task
from django.core.cache import cache
from enterprises.models import Enterprise

@shared_task
def fetch_hourly_weather():
    """
    Periodic task to fetch weather from Open-Meteo for all provinces
    registered by our Enterprises and store the results in Redis Cache 
    to lightning-speed the dashboard load time.
    """
    enterprises = Enterprise.objects.all()
    cached_provinces = set()

    for ent in enterprises:
        if ent.province in cached_provinces:
            continue
            
        print(f"Fetching weather for {ent.province}...")
        
        # 1. Geocode
        search_term = ent.province.split('-')[0].split(' ')[0]
        safe_name = urllib.parse.quote(search_term)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={safe_name}&count=1&language=fr"
        
        try:
            req = urllib.request.Request(geo_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode('utf-8'))
                if data.get('results') and len(data['results']) > 0:
                    result = data['results'][0]
                    lat, lng = result["latitude"], result["longitude"]
                else:
                    continue
        except Exception as e:
            print(f"Failed geocoding in worker for {ent.province}: {e}")
            continue

        # 2. Fetch Weather
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration&timezone=auto"
        try:
            req = urllib.request.Request(weather_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                weather_data = json.loads(response.read().decode('utf-8'))
                
                # Setup cache key unique to this latitude and longitude
                cache_key = f"weather_{round(lat, 2)}_{round(lng, 2)}"
                
                # Cache for exactly one hour
                cache.set(cache_key, weather_data, timeout=3600)
                cached_provinces.add(ent.province)
                print(f"Successfully cached 7-day weather for {ent.province}.")
        except Exception as e:
            print(f"Failed fetching weather in worker for {ent.province}: {e}")
            
    return f"Cached weather for {len(cached_provinces)} provinces."
