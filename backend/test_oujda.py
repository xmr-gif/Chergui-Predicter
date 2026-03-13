import urllib.request
import json
import urllib.parse
from datetime import datetime

# 1. Open-Meteo Check for Oujda
province = "Oujda-Angad"
search_term = province.split('-')[0].split(' ')[0]
safe_name = urllib.parse.quote(search_term)
geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={safe_name}&count=1&language=fr"
req = urllib.request.Request(geo_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    result = data['results'][0]
    lat, lng = result["latitude"], result["longitude"]

weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m&timezone=auto"
req = urllib.request.Request(weather_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    wdata = json.loads(response.read().decode('utf-8'))
    true_temp = wdata['current']['temperature_2m']
    print(f"--- OPEN-METEO TRUTH ---")
    print(f"Location: {result['name']}, {result.get('admin1', '')}")
    print(f"Coordinates: {lat}, {lng}")
    print(f"Current Temperature: {true_temp}°C")

print()
