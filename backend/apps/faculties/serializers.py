from rest_framework import serializers
from .models import Faculty, Department

class DepartmentSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)

    class Meta:
        model = Department
        fields = ('id', 'faculty', 'faculty_name', 'name', 'code', 'description', 'is_active', 'created_at', 'updated_at')

class FacultySerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Faculty
        fields = ('id', 'name', 'code', 'description', 'is_active', 'departments', 'created_at', 'updated_at')
