from django.db import models
from django.utils.translation import gettext_lazy as _

from adhocracy4.comments.models import Comment
from adhocracy4.models import base

STANCE_CHOICES = (
    # Translators: kosmo
    ('FAVOR', _('favor')),
    # Translators: kosmo
    ('AGAINST', _('against'))
)


class Stance(models.Model):

    stance = models.CharField(max_length=50,
                              choices=STANCE_CHOICES)

    comment_text = models.TextField(max_length=4000)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @property
    def project(self):
        return self.comment.module.project
