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


class EnterpriseProfileSerializer(serializers.ModelSerializer):
    """Serializer for reading/displaying enterprise profile."""

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
            'payment_status',
            'account_status',
            'created_at',
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


class UpdateProfileSerializer(serializers.Serializer):
    """Serializer for updating enterprise profile info."""
    company_name = serializers.CharField(max_length=255, required=False)
    contact_name = serializers.CharField(max_length=255, required=False)
    capacity = serializers.IntegerField(min_value=1, required=False)
    installation_type = serializers.ChoiceField(
        choices=['csp', 'bifacial', 'monofacial', 'hybrid'],
        required=False,
    )
    province = serializers.CharField(max_length=100, required=False)


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=6)


class RequestEmailChangeSerializer(serializers.Serializer):
    """Serializer for initiating email change (sends verification to old email)."""
    new_email = serializers.EmailField()
    password = serializers.CharField()


class ConfirmEmailChangeSerializer(serializers.Serializer):
    """Serializer for confirming email change with verification code."""
    verification_code = serializers.CharField(max_length=6, min_length=6)

