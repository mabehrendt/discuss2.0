# Generated by Django 2.2.6 on 2019-11-13 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('a4_candy_cms_settings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='importantpages',
            name='github_repo_link',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='importantpages',
            name='open_content_link',
            field=models.URLField(blank=True),
        ),
    ]