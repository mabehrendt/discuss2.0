# Generated by Django 3.2.13 on 2022-06-14 12:27

from django.db import migrations
import wagtail.blocks
import wagtail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('a4_candy_cms_use_cases', '0002_auto_20191106_1724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usecasepage',
            name='body_streamfield_de',
            field=wagtail.fields.StreamField([('paragraph', wagtail.blocks.RichTextBlock()), ('html', wagtail.blocks.RawHTMLBlock()), ('examples', wagtail.blocks.StructBlock([('examples', wagtail.blocks.ListBlock(wagtail.blocks.StructBlock([('body', wagtail.blocks.RichTextBlock(required=False)), ('link', wagtail.blocks.CharBlock(required=False)), ('link_text', wagtail.blocks.CharBlock(label='Link Text', max_length=50, required=False))], label='CTA Column')))]))], blank=True, use_json_field=True),
        ),
        migrations.AlterField(
            model_name='usecasepage',
            name='body_streamfield_en',
            field=wagtail.fields.StreamField([('paragraph', wagtail.blocks.RichTextBlock()), ('html', wagtail.blocks.RawHTMLBlock()), ('examples', wagtail.blocks.StructBlock([('examples', wagtail.blocks.ListBlock(wagtail.blocks.StructBlock([('body', wagtail.blocks.RichTextBlock(required=False)), ('link', wagtail.blocks.CharBlock(required=False)), ('link_text', wagtail.blocks.CharBlock(label='Link Text', max_length=50, required=False))], label='CTA Column')))]))], blank=True, use_json_field=True),
        ),
    ]
