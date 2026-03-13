from enterprises.models import Enterprise
from dashboard.ml_service import get_dashboard_data
ent = Enterprise.objects.get(company_name='TEST2')
print("--- DJANGO DASHBOARD DATA ---")
data = get_dashboard_data(ent)
print(f"Company: {ent.company_name} | Province: {ent.province}")
print(f"Today's Forecast Data: {data['forecasts'][0]}")
