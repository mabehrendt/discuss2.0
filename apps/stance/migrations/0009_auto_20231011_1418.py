# Generated by Django 3.2.19 on 2023-10-11 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('a4_candy_stance', '0008_remove_userstance_questionbox_shown'),
    ]

    operations = [
        migrations.AddField(
            model_name='userstance',
            name='questionbox_clicked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userstance',
            name='questionbox_shown',
            field=models.BooleanField(default=False),
        ),
    ]
