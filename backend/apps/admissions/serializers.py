from rest_framework import serializers
from .models import AdmissionApplication, StudentProfile
from faculties.models import Faculty, Department
from faculties.serializers import FacultySerializer, DepartmentSerializer

class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ('id', 'user', 'username', 'email', 'nationality', 'province', 'address', 'gender', 'date_of_birth', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class AdmissionApplicationSerializer(serializers.ModelSerializer):
    faculty_details = FacultySerializer(source='faculty', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)
    
    faculty = serializers.PrimaryKeyRelatedField(queryset=Faculty.objects.filter(is_active=True))
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.filter(is_active=True))

    class Meta:
        model = AdmissionApplication
        fields = (
            'id', 'user', 'faculty', 'faculty_details', 'department', 'department_details',
            'full_name', 'gender', 'marital_status', 'date_of_birth', 'nationality',
            'second_nationality', 'disability_condition', 'province', 'address',
            'permanent_country', 'current_country', 'permanent_residence', 'current_residence',
            'phone_number', 'email', 'parent_full_name', 'parent_relationship',
            'parent_phone_number', 'parent_email', 'parent_address',
            'previous_school', 'percentage_obtained',
            'academic_year', 'status', 'admin_comment', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'status', 'admin_comment', 'created_at', 'updated_at')

    def validate(self, data):
        faculty = data.get('faculty')
        department = data.get('department')
        if department and faculty and department.faculty != faculty:
            raise serializers.ValidationError({
                "department": "Le département choisi n'appartient pas à la faculté sélectionnée."
            })
        return data
