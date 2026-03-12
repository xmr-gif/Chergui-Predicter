from rest_framework import serializers
from .models import Enterprise


class EnterpriseSignupSerializer(serializers.ModelSerializer):
    """Serializer for enterprise signup (creation)."""
    password = serializers.CharField(write_only=True, min_length=6)

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
            'password',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        raw_password = validated_data.pop('password')
        enterprise = Enterprise(**validated_data)
        enterprise.set_password(raw_password)
        enterprise.save()
        return enterprise


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


class LoginSerializer(serializers.Serializer):
    """Serializer for enterprise login."""
    email = serializers.EmailField()
    password = serializers.CharField()


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for forgot password request."""
    email = serializers.EmailField()
