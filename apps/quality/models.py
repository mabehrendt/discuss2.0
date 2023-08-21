from django.db import models
from django.utils.translation import gettext_lazy as _

from adhocracy4.comments.models import Comment
from adhocracy4.models import base
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Quality(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    prediction = models.PositiveIntegerField()
    quality = models.TextField(max_length=4, choices=[('high', 'high'), ('low', 'low')])

    comment_text = models.TextField(max_length=4000)
    comment_id = models.PositiveIntegerField()
    creator = models.TextField(max_length=200)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @property
    def project(self):
        return self.comment.module.project
