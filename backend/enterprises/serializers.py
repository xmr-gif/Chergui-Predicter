from rest_framework import serializers
from .models import Enterprise


class EnterpriseSignupSerializer(serializers.ModelSerializer):
    """Serializer for enterprise signup (creation)."""

    class Meta:
        model = Enterprise
        fields = [
            'id',
            'company_name',
            'capacity',
            'installation_type',
            'province',
            'email',
            'contact_name',
        ]
        read_only_fields = ['id']


class EnterpriseStatusSerializer(serializers.ModelSerializer):
    """Serializer for checking enterprise account status."""

    class Meta:
        model = Enterprise
        fields = [
            'id',
            'company_name',
            'payment_status',
            'account_status',
        ]
        read_only_fields = fields


class PaymentConfirmSerializer(serializers.Serializer):
    """Serializer for payment confirmation."""
    enterprise_id = serializers.UUIDField()
