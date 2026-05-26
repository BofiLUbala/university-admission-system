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

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.email or self.username} ({self.role})"
