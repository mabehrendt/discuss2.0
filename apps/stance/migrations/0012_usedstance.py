# Generated by Django 3.2.19 on 2024-03-11 23:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('a4_candy_stance', '0011_alter_userstance_creator_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='UsedStance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('comment_id', models.PositiveIntegerField()),
                ('creator', models.TextField(max_length=200)),
                ('creator_id', models.CharField(max_length=500)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
        ),
    ]
