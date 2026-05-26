from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AdmissionApplication, StudentProfile
from .serializers import AdmissionApplicationSerializer, StudentProfileSerializer
from accounts.permissions import IsAdminUser

class AdmissionApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = AdmissionApplicationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return AdmissionApplication.objects.none()

        # If user is admin
        if user.role in ['SUPER_ADMIN', 'ADMISSION_OFFICER', 'FACULTY_ADMIN'] or user.is_staff:
            queryset = AdmissionApplication.objects.all().order_by('-created_at')
            
            # Simple filters
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)

            faculty_param = self.request.query_params.get('faculty')
            if faculty_param:
                queryset = queryset.filter(faculty_id=faculty_param)

            search_param = self.request.query_params.get('search')
            if search_param:
                queryset = queryset.filter(
                    models.Q(full_name__icontains=search_param) | 
                    models.Q(email__icontains=search_param) |
                    models.Q(previous_school__icontains=search_param)
                )
            return queryset

        # Standard student access
        return AdmissionApplication.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdminUser])
    def review(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        comment = request.data.get('admin_comment')

        valid_statuses = [choice[0] for choice in AdmissionApplication.STATUS_CHOICES]
        if new_status and new_status not in valid_statuses:
            return Response(
                {"error": f"Statut invalide. Choisissez parmi : {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status:
            application.status = new_status
        if comment is not None:
            application.admin_comment = comment

        application.save()

        # Create alert
        from notifications.models import Notification
        status_display = application.get_status_display()
        Notification.objects.create(
            user=application.user,
            title="Mise à jour de votre dossier",
            message=f"Le statut de votre candidature à l'ULK est désormais : {status_display}. Commentaire : {comment or 'Pas de commentaire.'}"
        )

        return Response(AdmissionApplicationSerializer(application).data)

class StudentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = StudentProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role in ['SUPER_ADMIN', 'ADMISSION_OFFICER'] or user.is_staff:
            return StudentProfile.objects.all()
        return StudentProfile.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
