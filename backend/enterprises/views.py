from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Enterprise
from .serializers import (
    EnterpriseSignupSerializer,
    EnterpriseStatusSerializer,
    PaymentConfirmSerializer,
)
from .emails import send_signup_notification


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
