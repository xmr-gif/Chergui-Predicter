from django.core.mail import send_mail
from django.conf import settings


def send_signup_notification(enterprise):
    """
    Send email notification to admin when a new enterprise signs up.
    """
    subject = f"[Bouclier Solaire] Nouvelle inscription — {enterprise.company_name}"

    message = f"""
Nouvelle inscription sur Bouclier Solaire !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DÉTAILS DE L'ENTREPRISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Entreprise :      {enterprise.company_name}
  Contact :         {enterprise.contact_name}
  Email :           {enterprise.email}
  Province :        {enterprise.province}
  Capacité :        {enterprise.capacity} MW
  Type :            {enterprise.get_installation_type_display()}
  Statut paiement : {enterprise.get_payment_status_display()}
  Date :            {enterprise.created_at.strftime('%d/%m/%Y %H:%M')}
  ID :              {enterprise.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pour activer ce compte, rendez-vous sur le panneau d'administration Django
et changez le statut du compte en "Actif".

http://localhost:8000/admin/enterprises/enterprise/{enterprise.id}/change/
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_NOTIFICATION_EMAIL],
        fail_silently=True,
    )
