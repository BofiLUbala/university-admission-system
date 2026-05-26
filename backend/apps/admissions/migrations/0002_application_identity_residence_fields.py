from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admissions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='admissionapplication',
            name='current_country',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='current_residence',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='disability_condition',
            field=models.CharField(choices=[('NONE', 'No disability'), ('PHYSICAL', 'Physical disability'), ('VISUAL', 'Visual impairment'), ('HEARING', 'Hearing impairment'), ('LEARNING', 'Learning disability'), ('OTHER', 'Other')], default='NONE', max_length=20),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='marital_status',
            field=models.CharField(choices=[('SINGLE', 'Single'), ('MARRIED', 'Married'), ('DIVORCED', 'Divorced'), ('WIDOWED', 'Widowed')], default='SINGLE', max_length=20),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='permanent_country',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='permanent_residence',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='admissionapplication',
            name='second_nationality',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
