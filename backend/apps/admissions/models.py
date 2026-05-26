from django.db import models
from django.conf import settings
from faculties.models import Faculty, Department

class StudentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    nationality = models.CharField(max_length=50, blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=(('M', 'Masculin'), ('F', 'Féminin')), blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'

    def __str__(self):
        return f"Profil de {self.user.get_full_name() or self.user.username}"

class AdmissionApplication(models.Model):
    STATUS_DRAFT = 'DRAFT'
    STATUS_SUBMITTED = 'SUBMITTED'
    STATUS_UNDER_REVIEW = 'UNDER_REVIEW'
    STATUS_APPROVED = 'APPROVED'
    STATUS_REJECTED = 'REJECTED'
    STATUS_WAITING_LIST = 'WAITING_LIST'

    STATUS_CHOICES = (
        (STATUS_DRAFT, 'Brouillon'),
        (STATUS_SUBMITTED, 'Soumis'),
        (STATUS_UNDER_REVIEW, 'En cours de traitement'),
        (STATUS_APPROVED, 'Approuvé'),
        (STATUS_REJECTED, 'Rejeté'),
        (STATUS_WAITING_LIST, 'Liste d\'attente'),
    )

    MARITAL_STATUS_CHOICES = (
        ('SINGLE', 'Single'),
        ('MARRIED', 'Married'),
        ('DIVORCED', 'Divorced'),
        ('WIDOWED', 'Widowed'),
    )

    DISABILITY_CONDITION_CHOICES = (
        ('NONE', 'No disability'),
        ('PHYSICAL', 'Physical disability'),
        ('VISUAL', 'Visual impairment'),
        ('HEARING', 'Hearing impairment'),
        ('LEARNING', 'Learning disability'),
        ('OTHER', 'Other'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    faculty = models.ForeignKey(Faculty, on_delete=models.SET_NULL, null=True, related_name='applications')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='applications')
    
    # Personal Info
    full_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10, choices=(('M', 'Masculin'), ('F', 'Féminin')))
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, default='SINGLE')
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=50)
    second_nationality = models.CharField(max_length=50, blank=True, null=True)
    disability_condition = models.CharField(max_length=20, choices=DISABILITY_CONDITION_CHOICES, default='NONE')
    province = models.CharField(max_length=50)
    address = models.TextField()
    permanent_country = models.CharField(max_length=100, default='')
    current_country = models.CharField(max_length=100, default='')
    permanent_residence = models.TextField(default='')
    current_residence = models.TextField(default='')
    phone_number = models.CharField(max_length=25)
    email = models.EmailField()

    # Parent / Guardian Info
    parent_full_name = models.CharField(max_length=150, default='')
    parent_relationship = models.CharField(max_length=50, default='')
    parent_phone_number = models.CharField(max_length=25, default='')
    parent_email = models.EmailField(default='')
    parent_address = models.TextField(default='')
    
    # Academic Info
    previous_school = models.CharField(max_length=150)
    percentage_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    academic_year = models.CharField(max_length=20, default='2025-2026')
    
    # Application State
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    admin_comment = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'applications'

    def __str__(self):
        return f"Candidature {self.id} - {self.full_name} ({self.status})"
