from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('application', 'document_type', 'status', 'uploaded_at')
    list_filter = ('document_type', 'status', 'uploaded_at')
    search_fields = ('application__full_name', 'application__email')
    readonly_fields = ('uploaded_at', 'updated_at')
