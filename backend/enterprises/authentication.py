from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Enterprise


class EnterpriseJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that resolves Enterprise objects
    instead of Django User objects from the token claims.
    """

    def get_user(self, validated_token):
        """
        Override: look up Enterprise by enterprise_id claim
        instead of the default user_id claim.
        """
        enterprise_id = validated_token.get('enterprise_id')
        if not enterprise_id:
            raise InvalidToken('Token contains no enterprise_id claim')

        try:
            enterprise = Enterprise.objects.get(id=enterprise_id)
        except Enterprise.DoesNotExist:
            raise InvalidToken('Enterprise not found')

        # DRF expects the user object to be "active" — duck-type it
        enterprise.is_active = enterprise.account_status == 'active'
        enterprise.is_authenticated = True
        return enterprise
