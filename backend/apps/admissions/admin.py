from django.contrib import admin

from .models import AdmissionApplication, StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nationality', 'province', 'gender', 'created_at')
    list_filter = ('gender', 'nationality', 'province')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'faculty', 'department', 'status', 'academic_year', 'created_at')
    list_filter = ('status', 'faculty', 'department', 'academic_year', 'created_at')
    search_fields = ('full_name', 'email', 'phone_number', 'previous_school')
    readonly_fields = ('created_at', 'updated_at')
