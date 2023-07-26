# Generated by Django 3.2.13 on 2022-06-14 12:27

import django.core.serializers.json
from django.db import migrations, models
import wagtail.contrib.forms.models


class Migration(migrations.Migration):

    dependencies = [
        ("a4_candy_cms_contacts", "0002_new_wagtail_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customformsubmission",
            name="form_data",
            field=models.JSONField(
                encoder=django.core.serializers.json.DjangoJSONEncoder
            ),
        ),
        migrations.AlterField(
            model_name="formfield",
            name="choices",
            field=models.TextField(
                blank=True,
                help_text="Comma or new line separated list of choices. Only applicable in checkboxes, radio and dropdown.",
                verbose_name="choices",
            ),
        ),
        migrations.AlterField(
            model_name="formfield",
            name="default_value",
            field=models.TextField(
                blank=True,
                help_text="Default value. Comma or new line separated values supported for checkboxes.",
                verbose_name="default value",
            ),
        ),
        migrations.AlterField(
            model_name="formpage",
            name="from_address",
            field=models.EmailField(
                blank=True, max_length=255, verbose_name="from address"
            ),
        ),
        migrations.AlterField(
            model_name="formpage",
            name="to_address",
            field=models.CharField(
                blank=True,
                help_text="Optional - form submissions will be emailed to these addresses. Separate multiple addresses by comma.",
                max_length=255,
                validators=[wagtail.contrib.forms.models.validate_to_address],
                verbose_name="to address",
            ),
        ),
    ]