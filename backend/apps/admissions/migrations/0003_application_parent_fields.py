from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admissions', '0002_application_identity_residence_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='admissionapplication',
            name='parent_address',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='parent_email',
            field=models.EmailField(default='', max_length=254),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='parent_full_name',
            field=models.CharField(default='', max_length=150),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='parent_phone_number',
            field=models.CharField(default='', max_length=25),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='parent_relationship',
            field=models.CharField(default='', max_length=50),
        ),
    ]
