# Generated by Django 2.2.20 on 2021-05-07 14:27

import ckeditor_uploader.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("a4_candy_topicprio", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="topic",
            name="description",
            field=ckeditor_uploader.fields.RichTextUploadingField(
                verbose_name="Description"
            ),
        ),
    ]
