from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('payment/confirm/', views.payment_confirm, name='payment-confirm'),
    path('account/status/<uuid:enterprise_id>/', views.account_status, name='account-status'),
]
