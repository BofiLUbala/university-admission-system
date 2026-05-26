import io
from django.http import HttpResponse, Http404
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Payment
from .serializers import PaymentSerializer
from admissions.models import AdmissionApplication
from notifications.models import Notification

# ReportLab Imports
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role in ['SUPER_ADMIN', 'ADMISSION_OFFICER'] or user.is_staff:
            return Payment.objects.all().order_by('-payment_date')
        return Payment.objects.filter(application__user=user).order_by('-payment_date')

    def perform_create(self, serializer):
        application_id = self.request.data.get('application')
        try:
            application = AdmissionApplication.objects.get(id=application_id, user=self.request.user)
        except AdmissionApplication.DoesNotExist:
            raise PermissionDenied("Vous n'êtes pas propriétaire de cette candidature.")

        # Simulate dynamic processing
        # Generate dynamic billing values
        operator = self.request.data.get('operator', 'MPESA')
        phone_number = self.request.data.get('phone_number')
        
        # Mocks the mobile money transaction processing (Immediate Success)
        payment = serializer.save(
            application=application,
            amount=50.00,  # Standard ULK Admission Fee
            currency='USD',
            operator=operator,
            phone_number=phone_number,
            status='SUCCESSFUL'
        )

        # Transition application to Submitted
        if application.status == 'DRAFT':
            application.status = 'SUBMITTED'
            application.save()

        # Generate Alerts
        Notification.objects.create(
            user=self.request.user,
            title="Paiement de frais validé",
            message=f"Votre paiement de 50.00 USD via {payment.get_operator_display()} a été reçu. Votre candidature #{application.id} est maintenant validée et soumise."
        )


class DownloadReceiptView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, payment_id):
        user = request.user
        try:
            if user.role in ['SUPER_ADMIN', 'ADMISSION_OFFICER'] or user.is_staff:
                payment = Payment.objects.get(id=payment_id)
            else:
                payment = Payment.objects.get(id=payment_id, application__user=user)
        except Payment.DoesNotExist:
            raise Http404("Paiement introuvable.")

        # Build PDF Receipt in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#0d3b66'), # ULK Blue
            alignment=1, # Center
            spaceAfter=15
        )
        
        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#555555'),
            alignment=1,
            spaceAfter=30
        )

        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#0d3b66'),
            spaceBefore=15,
            spaceAfter=10
        )

        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#333333')
        )

        elements = []

        # Branded Header
        elements.append(Paragraph("UNIVERSITÉ LIBRE DE KINSHASA", title_style))
        elements.append(Paragraph("Admissions Académiques - Reçu de Paiement Numérique", subtitle_style))
        elements.append(Spacer(1, 10))

        # Receipt general summary
        summary_data = [
            [Paragraph("<b>Référence de Paiement:</b>", body_style), Paragraph(payment.transaction_reference, body_style)],
            [Paragraph("<b>Numéro de Reçu:</b>", body_style), Paragraph(payment.receipt_number or "N/A", body_style)],
            [Paragraph("<b>Date & Heure:</b>", body_style), Paragraph(payment.payment_date.strftime("%d/%m/%Y %H:%M:%S"), body_style)],
            [Paragraph("<b>Statut:</b>", body_style), Paragraph("PAYÉ / RÉUSSI", ParagraphStyle('Green', parent=body_style, textColor=colors.HexColor('#2e7d32'), fontName='Helvetica-Bold'))],
        ]
        
        summary_table = Table(summary_data, colWidths=[200, 300])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8f9fa')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e0e0e0')),
        ]))
        
        elements.append(Paragraph("Informations de Transaction", section_heading))
        elements.append(summary_table)
        elements.append(Spacer(1, 20))

        # Candidate details
        app = payment.application
        candidate_data = [
            [Paragraph("<b>Candidat:</b>", body_style), Paragraph(app.full_name, body_style)],
            [Paragraph("<b>Adresse Email:</b>", body_style), Paragraph(app.email, body_style)],
            [Paragraph("<b>Téléphone de contact:</b>", body_style), Paragraph(app.phone_number, body_style)],
            [Paragraph("<b>Option Académique:</b>", body_style), Paragraph(f"{app.faculty.name} - {app.department.name}", body_style)],
            [Paragraph("<b>Année Académique:</b>", body_style), Paragraph(app.academic_year, body_style)],
        ]
        
        candidate_table = Table(candidate_data, colWidths=[200, 300])
        candidate_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ffffff')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e0e0e0')),
        ]))

        header_cell_style = ParagraphStyle(
            'HeaderCellStyle',
            parent=body_style,
            textColor=colors.whitesmoke,
            fontName='Helvetica-Bold'
        )

        elements.append(Paragraph("Détails du Candidat & Faculté", section_heading))
        elements.append(candidate_table)
        elements.append(Spacer(1, 20))

        # Billing Details
        billing_data = [
            [Paragraph("Description", header_cell_style), Paragraph("Opérateur", header_cell_style), Paragraph("Téléphone Payeur", header_cell_style), Paragraph("Montant", header_cell_style)],
            [Paragraph("Frais de Dossier d'Admission", body_style), Paragraph(payment.get_operator_display(), body_style), Paragraph(payment.phone_number, body_style), Paragraph(f"{payment.amount} {payment.currency}", body_style)],
        ]
        
        billing_table = Table(billing_data, colWidths=[180, 100, 120, 100])
        billing_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0d3b66')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e0e0e0')),
        ]))
        
        elements.append(Paragraph("Détails de Facturation", section_heading))
        elements.append(billing_table)
        elements.append(Spacer(1, 40))

        # Footer Seal
        footer_style = ParagraphStyle(
            'FooterStyle',
            parent=styles['Normal'],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor('#888888'),
            alignment=1
        )
        elements.append(Paragraph("Ce document est un reçu officiel généré automatiquement par le portail des admissions de l'ULK.", footer_style))
        elements.append(Paragraph("Université Libre de Kinshasa - Direction de l'Enseignement et des Admissions", footer_style))

        doc.build(elements)
        
        # Return response
        pdf = buffer.getvalue()
        buffer.close()
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="recu_{payment.transaction_reference}.pdf"'
        response.write(pdf)
        return response
