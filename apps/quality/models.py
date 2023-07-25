from django.db import models
from django.utils.translation import gettext_lazy as _

from adhocracy4.comments.models import Comment
from adhocracy4.models import base

QUALITY_CHOICES = (
    # Translators: kosmo
    ('ENHANCING', _('enhancing')),
    # Translators: kosmo
    ('NOT ENHANCING', _('notenhancing')),
)


class Quality(models.Model):

    quality = models.CharField(max_length=50,
                              choices=QUALITY_CHOICES)

    comment_text = models.TextField(max_length=4000)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @property
    def project(self):
        return self.comment.module.project
