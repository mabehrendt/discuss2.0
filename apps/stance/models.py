from django.db import models
from django.utils.translation import gettext_lazy as _

from adhocracy4.comments.models import Comment
from adhocracy4.models import base
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

STANCE_CHOICES = (
    # Translators: kosmo
    ('FAVOR', _('favor')),
    # Translators: kosmo
    ('AGAINST', _('against'))
)


class Stance(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey(ct_field="content_type", fk_field="object_id")

    stance = models.CharField(max_length=50,
                              choices=STANCE_CHOICES)

    comment_text = models.TextField(max_length=4000)


    comment_id = models.PositiveIntegerField()

    creator = models.TextField(max_length=200)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @property
    def project(self):
        return self.comment.module.project


class UserStance(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey(ct_field="content_type", fk_field="object_id")

    user_stance = models.CharField(max_length=50, default="")
    questionbox_shown = models.BooleanField(default=False)
    questionbox_clicked = models.BooleanField(default=False)

    creator = models.TextField(max_length=200)
    creator_id = models.CharField(max_length=500)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class UsedStance(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey(ct_field="content_type", fk_field="object_id")

    comment_id = models.PositiveIntegerField()

    creator = models.TextField(max_length=200)
    creator_id = models.CharField(max_length=500)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)