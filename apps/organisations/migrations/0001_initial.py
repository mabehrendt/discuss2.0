# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import autoslug.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Organisation',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('slug', autoslug.fields.AutoSlugField(unique=True, populate_from='name', editable=False)),
                ('name', models.CharField(max_length=512)),
                ('initiators', models.ManyToManyField(to=settings.AUTH_USER_MODEL, blank=True)),
            ],
        ),
    ]
