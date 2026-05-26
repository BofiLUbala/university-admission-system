import base64
import os
import time
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'profile_picture', 'created_at')
        read_only_fields = ('id', 'role', 'created_at')

    def update(self, instance, validated_data):
        profile_picture = validated_data.get('profile_picture', None)
        
        # If profile_picture is explicitly passed in the request (even if it is empty string or None)
        if 'profile_picture' in validated_data:
            if not profile_picture:
                # If there's an existing profile picture, delete its file from disk
                if instance.profile_picture and not instance.profile_picture.startswith('http') and not instance.profile_picture.startswith('data:'):
                    relative_path = instance.profile_picture.replace(settings.MEDIA_URL, '', 1)
                    file_path = os.path.join(settings.MEDIA_ROOT, relative_path)
                    if os.path.exists(file_path):
                        try:
                            os.remove(file_path)
                        except Exception as e:
                            print(f"Error deleting old profile picture: {e}")
                validated_data['profile_picture'] = ""
            elif profile_picture.startswith('data:image'):
                # It's a base64 image! Let's decode it and save it as a file on disk
                try:
                    format, imgstr = profile_picture.split(';base64,')
                    ext = format.split('/')[-1]
                    
                    # Determine unique filename
                    filename = f"profile_{instance.id}_{int(time.time())}.{ext}"
                    
                    # Delete the old file if it exists
                    if instance.profile_picture and not instance.profile_picture.startswith('http') and not instance.profile_picture.startswith('data:'):
                        relative_path = instance.profile_picture.replace(settings.MEDIA_URL, '', 1)
                        old_file_path = os.path.join(settings.MEDIA_ROOT, relative_path)
                        if os.path.exists(old_file_path):
                            try:
                                os.remove(old_file_path)
                            except Exception as e:
                                print(f"Error deleting old profile picture: {e}")
                                
                    # Ensure media directory exists
                    profile_pics_dir = os.path.join(settings.MEDIA_ROOT, 'profile_pictures')
                    os.makedirs(profile_pics_dir, exist_ok=True)
                    
                    # Save new file
                    data = ContentFile(base64.b64decode(imgstr), name=filename)
                    file_path = default_storage.save(os.path.join('profile_pictures', filename), data)
                    
                    # Set the new URL/path
                    validated_data['profile_picture'] = f"{settings.MEDIA_URL}{file_path}"
                except Exception as e:
                    print(f"Error processing base64 image: {e}")
            
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        profile_picture = representation.get('profile_picture')
        if profile_picture and not profile_picture.startswith('http') and not profile_picture.startswith('data:'):
            request = self.context.get('request')
            if request is not None:
                representation['profile_picture'] = request.build_absolute_uri(profile_picture)
            else:
                representation['profile_picture'] = f"http://localhost:8000{profile_picture}"
        return representation

class StudentRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'phone_number')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({"email": "Cette adresse email est déjà enregistrée."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create(
            role=User.STUDENT,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['username'] = user.username
        token['name'] = f"{user.first_name} {user.last_name}".strip() or user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'name': f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'phone_number': self.user.phone_number,
            'profile_picture': self.user.profile_picture
        }
        return data
