# Generated by Django 5.0.6 on 2024-06-05 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_event_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='event_image',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='event_images/'),
        ),
    ]
