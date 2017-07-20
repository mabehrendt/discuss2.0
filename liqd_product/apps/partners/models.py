from autoslug import AutoSlugField
from django.conf import settings
from django.db import models


class Partner(models.Model):
    slug = AutoSlugField(populate_from='name', unique=True)
    name = models.CharField(max_length=512)
    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
    )

    def __str__(self):
        return self.name
