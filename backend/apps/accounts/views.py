from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.conf import settings

from .serializers import StudentRegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from .utils import is_verification_token_valid, send_verification_email

User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class StudentRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentRegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        email_sent = getattr(serializer, '_email_sent', True)
        return Response(
            {
                "message": "Compte créé avec succès ! Un email de confirmation vous a été envoyé. "
                           "Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.",
                "email_sent": email_sent,
            },
            status=status.HTTP_201_CREATED
        )

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    token = request.query_params.get('token')
    if not token:
        return Response(
            {"error": "Token de vérification manquant."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email_verification_token=token)
    except User.DoesNotExist:
        return Response(
            {"error": "Token de vérification invalide ou déjà utilisé."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if user.is_email_verified:
        return Response(
            {"message": "Cette adresse email a déjà été vérifiée."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not is_verification_token_valid(user):
        return Response(
            {"error": "Le lien de vérification a expiré (2 heures). Veuillez vous réinscrire."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.is_email_verified = True
    user.email_verification_token = None
    user.email_verification_sent_at = None
    user.save(update_fields=['is_email_verified', 'email_verification_token', 'email_verification_sent_at'])

    return Response(
        {"message": "Email vérifié avec succès. Vous pouvez maintenant vous connecter."},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification_email(request):
    email = request.data.get('email')
    if not email:
        return Response(
            {"error": "Adresse email requise."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "Aucun compte trouvé avec cette adresse email."},
            status=status.HTTP_404_NOT_FOUND
        )

    if user.is_email_verified:
        return Response(
            {"message": "Cette adresse email est déjà vérifiée."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        send_verification_email(user)
        return Response(
            {"message": "Un nouveau lien de vérification a été envoyé à votre adresse email."},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": f"Erreur lors de l'envoi de l'email: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
