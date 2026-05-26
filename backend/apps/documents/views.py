from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Document
from .serializers import DocumentSerializer
from accounts.permissions import IsAdminUser
from admissions.models import AdmissionApplication

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role in ['SUPER_ADMIN', 'ADMISSION_OFFICER', 'FACULTY_ADMIN'] or user.is_staff:
            return Document.objects.all().order_by('-uploaded_at')
        return Document.objects.filter(application__user=user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        application_id = self.request.data.get('application')
        try:
            application = AdmissionApplication.objects.get(id=application_id, user=self.request.user)
        except AdmissionApplication.DoesNotExist:
            raise PermissionDenied("Vous n'êtes pas le propriétaire de cette candidature.")
        serializer.save(application=application)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdminUser])
    def review(self, request, pk=None):
        document = self.get_object()
        new_status = request.data.get('status')
        rejection_reason = request.data.get('rejection_reason')

        if new_status not in ['APPROVED', 'REJECTED']:
            return Response(
                {"error": "Le statut doit être APPROVED (Approuvé) ou REJECTED (Rejeté)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        document.status = new_status
        if new_status == 'REJECTED':
            document.rejection_reason = rejection_reason or "Document non conforme ou illisible."
        else:
            document.rejection_reason = None
        document.save()

        # Send alert
        from notifications.models import Notification
        status_fr = "Approuvé" if new_status == 'APPROVED' else "Rejeté"
        msg = f"Votre document ({document.get_document_type_display()}) a été {status_fr.lower()}."
        if new_status == 'REJECTED':
            msg += f" Motif : {document.rejection_reason}"
            
        Notification.objects.create(
            user=document.application.user,
            title="Vérification de vos pièces jointes",
            message=msg
        )

        return Response(DocumentSerializer(document).data)
