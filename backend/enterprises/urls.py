from django.urls import path
from . import views

urlpatterns = [
    # Signup & payment flow
    path('signup/', views.signup, name='signup'),
    path('payment/confirm/', views.payment_confirm, name='payment-confirm'),
    path('account/status/<uuid:enterprise_id>/', views.account_status, name='account-status'),

    # Authentication
    path('auth/login/', views.login, name='auth-login'),
    path('auth/refresh/', views.token_refresh, name='auth-refresh'),
    path('auth/forgot-password/', views.forgot_password, name='auth-forgot-password'),

    # Account Settings (requires JWT)
    path('account/profile/', views.profile, name='account-profile'),
    path('account/change-password/', views.change_password, name='account-change-password'),
    path('account/request-email-change/', views.request_email_change, name='account-request-email-change'),
    path('account/confirm-email-change/', views.confirm_email_change, name='account-confirm-email-change'),
    path('account/cancel-subscription/', views.cancel_subscription, name='account-cancel-subscription'),
]
