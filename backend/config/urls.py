"""URL configuration for Chergui-Predicter backend."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('enterprises.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
