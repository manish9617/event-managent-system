# Generated by Django 5.0.6 on 2024-06-05 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='total_attendees',
            field=models.IntegerField(default=100),
        ),
    ]
