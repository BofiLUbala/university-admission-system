import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    SUPER_ADMIN = 'SUPER_ADMIN'
    ADMISSION_OFFICER = 'ADMISSION_OFFICER'
    FACULTY_ADMIN = 'FACULTY_ADMIN'
    STUDENT = 'STUDENT'

    ROLE_CHOICES = (
        (SUPER_ADMIN, 'Super Admin'),
        (ADMISSION_OFFICER, 'Admission Officer'),
        (FACULTY_ADMIN, 'Faculty Admin'),
        (STUDENT, 'Student'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STUDENT)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.TextField(blank=True, null=True)
    
    # Track when the user was created
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Email verification fields
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True, unique=True)
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'users'

    def generate_verification_token(self):
        token = str(uuid.uuid4())
        self.email_verification_token = token
        return token

    def __str__(self):
        return f"{self.email or self.username} ({self.role})"
