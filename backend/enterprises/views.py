import uuid
import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Enterprise
from .serializers import (
    EnterpriseSignupSerializer,
    EnterpriseStatusSerializer,
    EnterpriseProfileSerializer,
    PaymentConfirmSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    UpdateProfileSerializer,
    ChangePasswordSerializer,
    RequestEmailChangeSerializer,
    ConfirmEmailChangeSerializer,
)
from .emails import (
    send_signup_notification,
    send_password_reset_email,
    send_email_verification_code,
)



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
                'cancelled': 'Votre abonnement a été résilié.',
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
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']

        try:
            enterprise = Enterprise.objects.get(email=email)
        except Enterprise.DoesNotExist:
            return Response(
                {'message': 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.'}
            )

        temp_password = uuid.uuid4().hex[:10]
        enterprise.set_password(temp_password)
        enterprise.save()

        send_password_reset_email(enterprise, temp_password)

        return Response(
            {'message': 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.'}
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Account Settings Endpoints ─────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    GET: Return the current enterprise's profile.
    PUT: Update profile info (company_name, contact_name, etc.).
    """
    enterprise = request.user

    if request.method == 'GET':
        serializer = EnterpriseProfileSerializer(enterprise)
        return Response(serializer.data)

    # PUT
    serializer = UpdateProfileSerializer(data=request.data)
    if serializer.is_valid():
        for field, value in serializer.validated_data.items():
            setattr(enterprise, field, value)
        enterprise.save()
        return Response(EnterpriseProfileSerializer(enterprise).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change password (requires current password)."""
    enterprise = request.user

    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        if not enterprise.verify_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Mot de passe actuel incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        enterprise.set_password(serializer.validated_data['new_password'])
        enterprise.save()
        return Response({'message': 'Mot de passe modifié avec succès.'})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_email_change(request):
    """
    Initiate email change: sends a 6-digit verification code to the OLD email.
    Requires password confirmation.
    """
    enterprise = request.user

    serializer = RequestEmailChangeSerializer(data=request.data)
    if serializer.is_valid():
        if not enterprise.verify_password(serializer.validated_data['password']):
            return Response(
                {'error': 'Mot de passe incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_email = serializer.validated_data['new_email']

        # Check if new email is already in use
        if Enterprise.objects.filter(email=new_email).exclude(id=enterprise.id).exists():
            return Response(
                {'error': 'Cet email est déjà utilisé par un autre compte.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate 6-digit code
        code = f"{random.randint(100000, 999999)}"
        enterprise.pending_email = new_email
        enterprise.email_verification_code = code
        enterprise.save()

        # Send code to OLD email
        send_email_verification_code(enterprise, code)

        return Response({
            'message': f'Un code de vérification a été envoyé à {enterprise.email}.',
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_email_change(request):
    """
    Confirm email change with the 6-digit verification code.
    """
    enterprise = request.user

    serializer = ConfirmEmailChangeSerializer(data=request.data)
    if serializer.is_valid():
        code = serializer.validated_data['verification_code']

        if not enterprise.email_verification_code or not enterprise.pending_email:
            return Response(
                {'error': 'Aucune demande de changement d\'email en cours.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if enterprise.email_verification_code != code:
            return Response(
                {'error': 'Code de vérification incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Apply the change
        enterprise.email = enterprise.pending_email
        enterprise.pending_email = None
        enterprise.email_verification_code = None
        enterprise.save()

        return Response({
            'message': 'Email modifié avec succès.',
            'new_email': enterprise.email,
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    """Cancel the enterprise subscription (sets status to cancelled)."""
    enterprise = request.user

    password = request.data.get('password')
    if not password or not enterprise.verify_password(password):
        return Response(
            {'error': 'Mot de passe incorrect. Veuillez confirmer votre identité.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    enterprise.account_status = 'cancelled'
    enterprise.save()

    return Response({'message': 'Votre abonnement a été résilié.'})
