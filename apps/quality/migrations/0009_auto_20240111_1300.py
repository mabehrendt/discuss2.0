# Generated by Django 3.2.19 on 2024-01-11 12:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('a4_candy_quality', '0008_alter_quality_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='quality',
            options={},
        ),
        migrations.RemoveField(
            model_name='quality',
            name='created',
        ),
        migrations.RemoveField(
            model_name='quality',
            name='modified',
        ),
    ]