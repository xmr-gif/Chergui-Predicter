from django.contrib import admin
from .models import Enterprise


@admin.register(Enterprise)
class EnterpriseAdmin(admin.ModelAdmin):
    """Admin panel for managing enterprise accounts."""

    list_display = [
        'company_name',
        'contact_name',
        'email',
        'province',
        'capacity',
        'payment_status',
        'account_status',
        'created_at',
    ]
    list_filter = ['account_status', 'payment_status', 'province', 'installation_type']
    search_fields = ['company_name', 'contact_name', 'email']
    list_editable = ['account_status']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Informations Entreprise', {
            'fields': ('id', 'company_name', 'contact_name', 'email'),
        }),
        ('Installation', {
            'fields': ('capacity', 'installation_type', 'province'),
        }),
        ('Statut', {
            'fields': ('payment_status', 'account_status', 'created_at'),
        }),
    )
