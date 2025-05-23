# Generated by Django 5.1.5 on 2025-05-11 12:16

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0006_alter_staff_expertise_alter_staff_languages'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='staff',
            options={'verbose_name_plural': 'Staff'},
        ),
        migrations.RemoveField(
            model_name='staff',
            name='updated_at',
        ),
        migrations.AlterField(
            model_name='staff',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='staff_avatars/'),
        ),
        migrations.AlterField(
            model_name='staff',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='staff',
            name='department',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='staff',
            name='expertise',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='staff',
            name='languages',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='staff',
            name='phone',
            field=models.CharField(max_length=15),
        ),
        migrations.AlterField(
            model_name='staff',
            name='role',
            field=models.CharField(max_length=50),
        ),
    ]
