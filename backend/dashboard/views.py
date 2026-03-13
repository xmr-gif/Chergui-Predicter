from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .ml_service import get_dashboard_data


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    """
    Returns AI-generated predictions and metrics for the dashboard.
    Loads the scikit-learn model, generates data for the 6 sites,
    and formats the response for the frontend components.
    """
    data = get_dashboard_data(request.user)
    
    if "error" in data:
        return Response(
            {"error": "Le modèle IA n'est pas chargé. Vérifiez les fichiers .pkl."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(data)
