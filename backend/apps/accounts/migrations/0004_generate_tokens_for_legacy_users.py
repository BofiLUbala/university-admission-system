import uuid
from django.db import migrations
from django.utils import timezone


def generate_tokens(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    now = timezone.now()
    for user in User.objects.filter(is_email_verified=False):
        user.email_verification_token = str(uuid.uuid4())
        user.email_verification_sent_at = now
        user.save(update_fields=['email_verification_token', 'email_verification_sent_at'])


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_user_email_verification_sent_at_and_more'),
    ]

    operations = [
        migrations.RunPython(generate_tokens, reverse_code=migrations.RunPython.noop),
    ]
