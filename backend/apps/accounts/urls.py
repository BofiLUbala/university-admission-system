from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView, StudentRegisterView, ProfileView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', StudentRegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
