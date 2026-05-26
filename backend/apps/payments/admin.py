from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_reference', 'application', 'operator', 'amount', 'currency', 'status', 'payment_date')
    list_filter = ('operator', 'status', 'currency', 'payment_date')
    search_fields = ('transaction_reference', 'receipt_number', 'application__full_name')
    readonly_fields = ('transaction_reference', 'receipt_number', 'payment_date', 'updated_at')
