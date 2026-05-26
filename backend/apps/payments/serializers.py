from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    operator_display = serializers.CharField(source='get_operator_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payment
        fields = (
            'id', 'application', 'operator', 'operator_display', 'phone_number', 'amount',
            'currency', 'transaction_reference', 'status', 'status_display', 'receipt_number',
            'payment_date', 'updated_at'
        )
        read_only_fields = ('id', 'transaction_reference', 'status', 'receipt_number', 'payment_date', 'updated_at')
