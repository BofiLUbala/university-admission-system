from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('id', 'application', 'document_type', 'file', 'status', 'rejection_reason', 'uploaded_at', 'updated_at')
        read_only_fields = ('id', 'status', 'rejection_reason', 'uploaded_at', 'updated_at')
