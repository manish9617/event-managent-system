# Generated by Django 5.0.6 on 2024-06-06 20:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_event_event_image_alter_event_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='eventregistration',
            name='ticket_qr',
        ),
        migrations.AddField(
            model_name='eventregistration',
            name='ticket_qr_image',
            field=models.ImageField(blank=True, null=True, upload_to='ticket_qr_codes/'),
        ),
    ]
