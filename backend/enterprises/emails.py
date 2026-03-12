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


def send_password_reset_email(enterprise, temp_password):
    """
    Send a password reset email with a temporary password.
    """
    subject = "[Bouclier Solaire] Réinitialisation de mot de passe"

    message = f"""
Bonjour {enterprise.contact_name},

Vous avez demandé la réinitialisation de votre mot de passe
pour le compte de {enterprise.company_name} sur Bouclier Solaire.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  VOTRE NOUVEAU MOT DE PASSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {temp_password}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connectez-vous avec ce mot de passe temporaire sur :
http://localhost:3000/login

Cordialement,
L'équipe Bouclier Solaire
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[enterprise.email],
        fail_silently=True,
    )


def send_email_verification_code(enterprise, code):
    """
    Send a 6-digit verification code to the enterprise's CURRENT email
    for confirming an email change request.
    """
    subject = "[Bouclier Solaire] Code de vérification pour changement d'email"

    message = f"""
Bonjour {enterprise.contact_name},

Vous avez demandé le changement de votre adresse email
pour le compte de {enterprise.company_name} sur Bouclier Solaire.

Nouvelle adresse demandée : {enterprise.pending_email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  VOTRE CODE DE VÉRIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {code}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si vous n'avez pas demandé ce changement, ignorez cet email.
Ce code expire lors de la prochaine demande.

Cordialement,
L'équipe Bouclier Solaire
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[enterprise.email],  # Send to OLD email for verification
        fail_silently=True,
    )
