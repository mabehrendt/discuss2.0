# Generated by Django 3.2.19 on 2023-10-11 12:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('a4_candy_stance', '0007_userstance_questionbox_shown'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userstance',
            name='questionbox_shown',
        ),
    ]
