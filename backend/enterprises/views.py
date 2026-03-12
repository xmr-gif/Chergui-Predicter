import uuid
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Enterprise
from .serializers import (
    EnterpriseSignupSerializer,
    EnterpriseStatusSerializer,
    PaymentConfirmSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
)
from .emails import send_signup_notification, send_password_reset_email


@api_view(['POST'])
def signup(request):
    """
    Register a new enterprise.
    Returns the enterprise ID for subsequent payment and status checks.
    """
    serializer = EnterpriseSignupSerializer(data=request.data)
    if serializer.is_valid():
        enterprise = serializer.save()
        return Response(
            {
                'id': str(enterprise.id),
                'message': 'Inscription enregistrée avec succès.',
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def payment_confirm(request):
    """
    Confirm payment for an enterprise (simulated Mastercard payment).
    Marks payment as completed and sends notification email.
    """
    serializer = PaymentConfirmSerializer(data=request.data)
    if serializer.is_valid():
        try:
            enterprise = Enterprise.objects.get(
                id=serializer.validated_data['enterprise_id']
            )
        except Enterprise.DoesNotExist:
            return Response(
                {'error': 'Entreprise non trouvée.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        enterprise.payment_status = 'completed'
        enterprise.account_status = 'pending_activation'
        enterprise.save()

        # Send email notification to admin
        send_signup_notification(enterprise)

        return Response(
            {
                'message': 'Paiement confirmé. Votre compte est en attente d\'activation.',
                'account_status': enterprise.account_status,
            }
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def account_status(request, enterprise_id):
    """
    Check the activation status of an enterprise account.
    Polled by the waiting page on the frontend.
    """
    try:
        enterprise = Enterprise.objects.get(id=enterprise_id)
    except Enterprise.DoesNotExist:
        return Response(
            {'error': 'Entreprise non trouvée.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = EnterpriseStatusSerializer(enterprise)
    return Response(serializer.data)


# ─── Auth Endpoints ─────────────────────────────────────────────

def _get_tokens_for_enterprise(enterprise):
    """Generate JWT access + refresh tokens for an enterprise."""
    refresh = RefreshToken()
    refresh['enterprise_id'] = str(enterprise.id)
    refresh['email'] = enterprise.email
    refresh['company_name'] = enterprise.company_name
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'enterprise': {
            'id': str(enterprise.id),
            'company_name': enterprise.company_name,
            'email': enterprise.email,
        },
    }


@api_view(['POST'])
def login(request):
    """
    Authenticate an enterprise with email + password.
    Returns JWT access and refresh tokens.
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            enterprise = Enterprise.objects.get(email=email)
        except Enterprise.DoesNotExist:
            return Response(
                {'error': 'Email ou mot de passe incorrect.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not enterprise.verify_password(password):
            return Response(
                {'error': 'Email ou mot de passe incorrect.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if enterprise.account_status != 'active':
            status_messages = {
                'pending_payment': 'Votre paiement n\'a pas encore été effectué.',
                'pending_activation': 'Votre compte est en attente d\'activation par notre équipe.',
            }
            return Response(
                {
                    'error': status_messages.get(
                        enterprise.account_status,
                        'Votre compte n\'est pas encore actif.'
                    ),
                    'account_status': enterprise.account_status,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = _get_tokens_for_enterprise(enterprise)
        return Response(tokens)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def token_refresh(request):
    """
    Refresh an access token using a valid refresh token.
    """
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response(
            {'error': 'Refresh token requis.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        refresh = RefreshToken(refresh_token)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    except Exception:
        return Response(
            {'error': 'Token invalide ou expiré.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(['POST'])
def forgot_password(request):
    """
    Send a password reset email to the enterprise.
    For hackathon: the new password is generated and logged to console.
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']

        try:
            enterprise = Enterprise.objects.get(email=email)
        except Enterprise.DoesNotExist:
            # Don't reveal whether email exists — always return success
            return Response(
                {'message': 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.'}
            )

        # Generate a temporary password for hackathon demo
        temp_password = uuid.uuid4().hex[:10]
        enterprise.set_password(temp_password)
        enterprise.save()

        send_password_reset_email(enterprise, temp_password)

        return Response(
            {'message': 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.'}
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
