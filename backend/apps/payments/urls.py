from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, DownloadReceiptView

router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('payments/<int:payment_id>/receipt/', DownloadReceiptView.as_view(), name='payment_receipt'),
]
