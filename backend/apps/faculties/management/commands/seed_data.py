from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faculties.models import Faculty, Department
from admissions.models import AdmissionApplication, StudentProfile
from payments.models import Payment
from notifications.models import Notification
from documents.models import Document
from django.core.files.base import ContentFile
import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with ULK faculties, departments, admin accounts, and sample student data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting database seed..."))

        # 1. Create Admins and Users
        self.stdout.write("Creating user accounts...")
        
        # Super Admin
        super_admin, created = User.objects.get_or_create(
            username='superadmin',
            email='superadmin@ulk.ac.cd',
            defaults={
                'first_name': 'Super',
                'last_name': 'Admin',
                'role': User.SUPER_ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'phone_number': '+243812345678'
            }
        )
        if created:
            super_admin.set_password('adminpassword123')
            super_admin.save()
            self.stdout.write("Created Super Admin: superadmin@ulk.ac.cd / adminpassword123")

        # Admission Officer
        officer, created = User.objects.get_or_create(
            username='officer',
            email='officer@ulk.ac.cd',
            defaults={
                'first_name': 'Jean',
                'last_name': 'Mukendi',
                'role': User.ADMISSION_OFFICER,
                'is_staff': True,
                'phone_number': '+243823456789'
            }
        )
        if created:
            officer.set_password('adminpassword123')
            officer.save()
            self.stdout.write("Created Admission Officer: officer@ulk.ac.cd / adminpassword123")

        # Faculty Admin
        faculty_admin, created = User.objects.get_or_create(
            username='faculty_admin',
            email='faculty@ulk.ac.cd',
            defaults={
                'first_name': 'Prof. Marie',
                'last_name': 'Kabamba',
                'role': User.FACULTY_ADMIN,
                'is_staff': True,
                'phone_number': '+243834567890'
            }
        )
        if created:
            faculty_admin.set_password('adminpassword123')
            faculty_admin.save()
            self.stdout.write("Created Faculty Admin: faculty@ulk.ac.cd / adminpassword123")

        # Sample Student 1
        student1, created = User.objects.get_or_create(
            username='student1',
            email='student1@gmail.com',
            defaults={
                'first_name': 'Gloire',
                'last_name': 'Kabasele',
                'role': User.STUDENT,
                'phone_number': '+243898765432'
            }
        )
        if created:
            student1.set_password('studentpassword123')
            student1.save()
            
            # Create student profile
            StudentProfile.objects.get_or_create(
                user=student1,
                defaults={
                    'nationality': 'Congolaise',
                    'province': 'Kinshasa',
                    'address': 'Av. de la Libération, Q/Gombe, Kinshasa',
                    'gender': 'M',
                    'date_of_birth': datetime.date(2004, 5, 12)
                }
            )
            self.stdout.write("Created Student 1: student1@gmail.com / studentpassword123")

        # Sample Student 2 (For approved state)
        student2, created = User.objects.get_or_create(
            username='student2',
            email='student2@gmail.com',
            defaults={
                'first_name': 'Sarah',
                'last_name': 'Mbuyi',
                'role': User.STUDENT,
                'phone_number': '+243845678912'
            }
        )
        if created:
            student2.set_password('studentpassword123')
            student2.save()
            StudentProfile.objects.get_or_create(
                user=student2,
                defaults={
                    'nationality': 'Congolaise',
                    'province': 'Kongo-Central',
                    'address': 'N°12, Av. Mobutu, Matadi',
                    'gender': 'F',
                    'date_of_birth': datetime.date(2003, 9, 20)
                }
            )
            self.stdout.write("Created Student 2: student2@gmail.com / studentpassword123")

        # Sample Student 3 (For rejected state)
        student3, created = User.objects.get_or_create(
            username='student3',
            email='student3@gmail.com',
            defaults={
                'first_name': 'Christian',
                'last_name': 'Lelo',
                'role': User.STUDENT,
                'phone_number': '+243856789123'
            }
        )
        if created:
            student3.set_password('studentpassword123')
            student3.save()
            StudentProfile.objects.get_or_create(
                user=student3,
                defaults={
                    'nationality': 'Congolaise',
                    'province': 'Haut-Katanga',
                    'address': 'Av. Likasi, Lubumbashi',
                    'gender': 'M',
                    'date_of_birth': datetime.date(2005, 1, 15)
                }
            )
            self.stdout.write("Created Student 3: student3@gmail.com / studentpassword123")

        # 2. Create Faculties and Departments
        self.stdout.write("Creating faculties and departments...")
        
        # Faculty 1: Sciences Informatiques
        f1, _ = Faculty.objects.get_or_create(
            code='FI',
            defaults={
                'name': 'Faculté des Sciences Informatiques',
                'description': 'Formations avancées en ingénierie logicielle, réseaux informatiques et systèmes intelligents.',
                'is_active': True
            }
        )
        
        dep1_1, _ = Department.objects.get_or_create(
            faculty=f1, name='Génie Logiciel',
            defaults={'code': 'GL', 'description': 'Conception et développement d\'applications complexes et systèmes d\'information.', 'is_active': True}
        )
        dep1_2, _ = Department.objects.get_or_create(
            faculty=f1, name='Réseaux et Télécommunications',
            defaults={'code': 'RT', 'description': 'Administration réseaux, cybersécurité et infrastructures télécoms.', 'is_active': True}
        )
        dep1_3, _ = Department.objects.get_or_create(
            faculty=f1, name='Intelligence Artificielle',
            defaults={'code': 'IA', 'description': 'Machine Learning, analyse de données et systèmes autonomes.', 'is_active': True}
        )

        # Faculty 2: Sciences Juridiques (Droit)
        f2, _ = Faculty.objects.get_or_create(
            code='DR',
            defaults={
                'name': 'Faculté de Droit',
                'description': 'Formation des futurs juristes, avocats et magistrats en RDC.',
                'is_active': True
            }
        )
        
        dep2_1, _ = Department.objects.get_or_create(
            faculty=f2, name='Droit Public',
            defaults={'code': 'DP', 'description': 'Droit constitutionnel, administratif et international public.', 'is_active': True}
        )
        dep2_2, _ = Department.objects.get_or_create(
            faculty=f2, name='Droit Privé et Judiciaire',
            defaults={'code': 'DF', 'description': 'Droit des affaires, droit civil, pénal et procédures judiciaires.', 'is_active': True}
        )

        # Faculty 3: Sciences Économiques et Gestion
        f3, _ = Faculty.objects.get_or_create(
            code='EG',
            defaults={
                'name': 'Faculté des Sciences Économiques et de Gestion',
                'description': 'Sciences de gestion commerciale, comptabilité, finance et économie générale.',
                'is_active': True
            }
        )
        
        dep3_1, _ = Department.objects.get_or_create(
            faculty=f3, name='Gestion Financière',
            defaults={'code': 'GF', 'description': 'Comptabilité approfondie, audit, finance d\'entreprise et marchés.', 'is_active': True}
        )
        dep3_2, _ = Department.objects.get_or_create(
            faculty=f3, name='Économie de Développement',
            defaults={'code': 'ED', 'description': 'Politiques économiques, développement durable et microfinance.', 'is_active': True}
        )

        self.stdout.write("Faculties and departments seeded successfully.")

        # 3. Create Sample Applications, Payments, and Documents
        self.stdout.write("Seeding applications...")

        # Application 1: Student 1 - Submitted Application with successful payment
        app1, created = AdmissionApplication.objects.get_or_create(
            user=student1,
            defaults={
                'faculty': f1,
                'department': dep1_1,
                'full_name': 'Gloire Kabasele',
                'gender': 'M',
                'date_of_birth': datetime.date(2004, 5, 12),
                'nationality': 'Congolaise',
                'province': 'Kinshasa',
                'address': 'Av. de la Libération, Q/Gombe, Kinshasa',
                'phone_number': '+243898765432',
                'email': 'student1@gmail.com',
                'previous_school': 'Collège Boboto',
                'percentage_obtained': 76.50,
                'academic_year': '2025-2026',
                'status': AdmissionApplication.STATUS_SUBMITTED
            }
        )
        if created:
            # Payment
            Payment.objects.create(
                application=app1,
                operator='MPESA',
                phone_number='+243898765432',
                amount=50.00,
                currency='USD',
                status='SUCCESSFUL'
            )
            
            # Seed mock files
            mock_file = ContentFile(b"fake diploma pdf content")
            mock_file.name = "diplome_gloire.pdf"
            
            Document.objects.create(
                application=app1,
                document_type='DIPLOMA',
                file=mock_file,
                status='PENDING'
            )

            # In-app notifications
            Notification.objects.create(
                user=student1,
                title="Candidature reçue",
                message="Votre candidature pour la Faculté des Sciences Informatiques (Génie Logiciel) a été soumise avec succès après validation du paiement."
            )
            self.stdout.write("Created Submitted Application for Gloire Kabasele")

        # Application 2: Student 2 - Approved Application
        app2, created = AdmissionApplication.objects.get_or_create(
            user=student2,
            defaults={
                'faculty': f1,
                'department': dep1_3, # AI
                'full_name': 'Sarah Mbuyi',
                'gender': 'F',
                'date_of_birth': datetime.date(2003, 9, 20),
                'nationality': 'Congolaise',
                'province': 'Kongo-Central',
                'address': 'N°12, Av. Mobutu, Matadi',
                'phone_number': '+243845678912',
                'email': 'student2@gmail.com',
                'previous_school': 'Lycée Shaumba',
                'percentage_obtained': 82.00,
                'academic_year': '2025-2026',
                'status': AdmissionApplication.STATUS_APPROVED,
                'admin_comment': 'Excellentes notes académiques. Candidature chaleureusement approuvée.'
            }
        )
        if created:
            # Payment
            Payment.objects.create(
                application=app2,
                operator='AIRTEL',
                phone_number='+243845678912',
                amount=50.00,
                currency='USD',
                status='SUCCESSFUL'
            )
            
            # Documents APPROVED
            mock_file = ContentFile(b"fake photo content")
            mock_file.name = "photo_sarah.jpg"
            Document.objects.create(
                application=app2,
                document_type='PHOTO',
                file=mock_file,
                status='APPROVED'
            )

            # Notifications
            Notification.objects.create(
                user=student2,
                title="Candidature Approuvée !",
                message="Félicitations Sarah Mbuyi, votre candidature à l'ULK pour l'année 2025-2026 a été approuvée. Téléchargez votre lettre d'admission."
            )
            self.stdout.write("Created Approved Application for Sarah Mbuyi")

        # Application 3: Student 3 - Rejected Application
        app3, created = AdmissionApplication.objects.get_or_create(
            user=student3,
            defaults={
                'faculty': f3,
                'department': dep3_1, # Finance
                'full_name': 'Christian Lelo',
                'gender': 'M',
                'date_of_birth': datetime.date(2005, 1, 15),
                'nationality': 'Congolaise',
                'province': 'Haut-Katanga',
                'address': 'Av. Likasi, Lubumbashi',
                'phone_number': '+243856789123',
                'email': 'student3@gmail.com',
                'previous_school': 'Collège Imara',
                'percentage_obtained': 52.00,
                'academic_year': '2025-2026',
                'status': AdmissionApplication.STATUS_REJECTED,
                'admin_comment': 'Pourcentage de diplôme insuffisant pour s\'inscrire en faculté de gestion financière (seuil requis de 60%).'
            }
        )
        if created:
            # Payment
            Payment.objects.create(
                application=app3,
                operator='ORANGE',
                phone_number='+243856789123',
                amount=50.00,
                currency='USD',
                status='SUCCESSFUL'
            )
            
            # Rejected Doc
            mock_file = ContentFile(b"fake bad transcript")
            mock_file.name = "notes_lelo.png"
            Document.objects.create(
                application=app3,
                document_type='TRANSCRIPT',
                file=mock_file,
                status='REJECTED',
                rejection_reason="Relevé de notes incomplet."
            )

            # Notifications
            Notification.objects.create(
                user=student3,
                title="Refus de Candidature",
                message="Votre candidature n'a pas été retenue à l'ULK. Raison : Pourcentage insuffisant. Veuillez nous contacter pour d'autres options."
            )
            self.stdout.write("Created Rejected Application for Christian Lelo")

        # Mark all seed users as email-verified so they can log in
        for user in [super_admin, officer, faculty_admin, student1, student2, student3]:
            if not user.is_email_verified:
                user.is_email_verified = True
                user.save(update_fields=['is_email_verified'])

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
