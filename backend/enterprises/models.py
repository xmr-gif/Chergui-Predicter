import uuid
from django.db import models


class Enterprise(models.Model):
    """Enterprise registration for Bouclier Solaire."""

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('completed', 'Complété'),
    ]

    ACCOUNT_STATUS_CHOICES = [
        ('pending_payment', 'En attente de paiement'),
        ('pending_activation', 'En attente d\'activation'),
        ('active', 'Actif'),
    ]

    INSTALLATION_TYPE_CHOICES = [
        ('csp', 'CSP'),
        ('bifacial', 'Bifacial PV'),
        ('monofacial', 'Monofacial PV'),
        ('hybrid', 'Hybride'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField('Nom de l\'entreprise', max_length=255)
    capacity = models.PositiveIntegerField('Capacité (MW)')
    installation_type = models.CharField(
        'Type d\'installation',
        max_length=20,
        choices=INSTALLATION_TYPE_CHOICES,
    )
    province = models.CharField('Province', max_length=100)
    email = models.EmailField('Email professionnel')
    contact_name = models.CharField('Nom du contact', max_length=255)
    payment_status = models.CharField(
        'Statut de paiement',
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending',
    )
    account_status = models.CharField(
        'Statut du compte',
        max_length=20,
        choices=ACCOUNT_STATUS_CHOICES,
        default='pending_payment',
    )
    created_at = models.DateTimeField('Date de création', auto_now_add=True)

    class Meta:
        verbose_name = 'Entreprise'
        verbose_name_plural = 'Entreprises'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} — {self.get_account_status_display()}"
