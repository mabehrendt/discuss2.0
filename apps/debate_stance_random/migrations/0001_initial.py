# Generated by Django 3.2.19 on 2023-12-19 12:34

import autoslug.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('a4modules', '0007_verbose_name_created_modified'),
    ]

    operations = [
        migrations.CreateModel(
            name='AIStanceSubject',
            fields=[
                ('item_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='a4modules.item')),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from='name', unique=True)),
                ('name', models.CharField(help_text='max 120 characters', max_length=120, verbose_name='Title')),
                ('description', models.CharField(blank=True, help_text='In addition to the title, you can insert an optional explanatory text (max. 350 char.). This field is only shown in the participation if it is filled out.', max_length=350, verbose_name='Description')),
            ],
            options={
                'ordering': ['-created'],
            },
            bases=('a4modules.item',),
        ),
    ]
