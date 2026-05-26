from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionApplicationViewSet, StudentProfileViewSet

router = DefaultRouter()
router.register(r'applications', AdmissionApplicationViewSet, basename='application')
router.register(r'students', StudentProfileViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
]
