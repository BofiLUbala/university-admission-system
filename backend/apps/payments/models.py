import uuid
from django.db import models
from admissions.models import AdmissionApplication

class Payment(models.Model):
    OPERATOR_CHOICES = (
        ('MPESA', 'M-Pesa (Vodacom)'),
        ('AIRTEL', 'Airtel Money'),
        ('ORANGE', 'Orange Money'),
        ('MOBILE_MONEY', 'Mobile Money (Afriland/Rawbank)'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('SUCCESSFUL', 'Réussi'),
        ('FAILED', 'Échoué'),
    )

    application = models.ForeignKey(AdmissionApplication, on_delete=models.CASCADE, related_name='payments')
    operator = models.CharField(max_length=20, choices=OPERATOR_CHOICES)
    phone_number = models.CharField(max_length=25)
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Admission fee
    currency = models.CharField(max_length=5, default='USD')
    transaction_reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    receipt_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'

    def save(self, *args, **kwargs):
        if not self.transaction_reference:
            self.transaction_reference = 'TXN-' + str(uuid.uuid4().hex[:12]).upper()
        if self.status == 'SUCCESSFUL' and not self.receipt_number:
            self.receipt_number = 'REC-' + str(uuid.uuid4().hex[:10]).upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Paiement {self.transaction_reference} - {self.application.full_name} ({self.status})"
