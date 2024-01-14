from django.contrib.auth.models import AnonymousUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4 import transforms
from adhocracy4.categories.fields import CategoryField
from adhocracy4.ckeditor.fields import RichTextCollapsibleUploadingField
from adhocracy4.images.fields import ConfiguredImageField
from adhocracy4.models.base import TimeStampedModel
from adhocracy4.modules import models as module_models


class AnonymousItem(TimeStampedModel):
    module = models.ForeignKey(module_models.Module, on_delete=models.CASCADE)

    @property
    def project(self):
        return self.module.project

    @property
    def creator(self):
        return AnonymousUser()

    @creator.setter
    def creator(self, value):
        pass

    class Meta:
        abstract = True


class LikeQuerySet(models.QuerySet):
    def annotate_like_count(self):
        return self.annotate(
            like_count=models.Count("livequestion_likes", distinct=True)
        )


class LiveQuestion(AnonymousItem):
    text = models.TextField(max_length=1000, verbose_name=_("Question"))
    is_answered = models.BooleanField(default=False)
    is_on_shortlist = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)
    is_live = models.BooleanField(default=False)

    category = CategoryField(verbose_name=_("Characteristic"))

    objects = LikeQuerySet.as_manager()

    def __str__(self):
        return str(self.text)

    def get_absolute_url(self):
        return reverse(
            "module-detail",
            args=[str(self.module.project.organisation.slug), str(self.module.slug)],
        )


class Like(models.Model):
    session = models.CharField(max_length=255)
    livequestion = models.ForeignKey(
        LiveQuestion, related_name="livequestion_likes", on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "livequestion")


class ExtraFieldsInteractiveEvent(module_models.Item):
    live_stream = RichTextCollapsibleUploadingField(
        verbose_name="Live Stream", blank=True, config_name="video-editor"
    )

    event_image = ConfiguredImageField(
        "eventimage",
        verbose_name=_("Event image"),
        help_prefix=_("The image is displayed next to the event description."),
        upload_to="interactiveevents/images",
        blank=True,
    )

    def save(self, *args, **kwargs):
        self.live_stream = transforms.clean_html_field(self.live_stream, "video-editor")
        super().save(*args, **kwargs)
