from rest_framework import viewsets, permissions
from .models import Faculty, Department
from .serializers import FacultySerializer, DepartmentSerializer
from accounts.permissions import IsAdminUser

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all().order_by('name')
    serializer_class = FacultySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]
