import os
from django.db import models
from django.core.exceptions import ValidationError
from admissions.models import AdmissionApplication

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
    if not ext.lower() in valid_extensions:
        raise ValidationError("Format de fichier non pris en charge. Formats acceptés : PDF, JPG, PNG.")

def validate_file_size(value):
    if value.size > 5 * 1024 * 1024:  # 5 MB
        raise ValidationError("La taille maximale du fichier autorisée est de 5 Mo.")

class Document(models.Model):
    DOC_TYPES = (
        ('DIPLOMA', 'Diplôme d\'État / Certificat'),
        ('TRANSCRIPT', 'Relevé de notes'),
        ('PHOTO', 'Photo Passeport'),
        ('BIRTH_CERTIFICATE', 'Acte de Naissance'),
        ('ID_CARD', 'Carte d\'Identité / Passeport'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('APPROVED', 'Approuvé'),
        ('REJECTED', 'Rejeté'),
    )

    application = models.ForeignKey(AdmissionApplication, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=30, choices=DOC_TYPES)
    file = models.FileField(upload_to='applications/documents/', validators=[validate_file_extension, validate_file_size])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents'
        unique_together = ('application', 'document_type')

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.application.full_name}"
