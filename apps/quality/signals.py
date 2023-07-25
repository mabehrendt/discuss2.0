import logging
from django.conf import settings
from django.db.models import signals
from django.dispatch import receiver
from ai.argument_quality import QualityPredictor

from adhocracy4.comments.models import Comment

from .models import Quality

@receiver(signals.post_save, sender=Comment)
def get_quality(sender, instance, created, update_fields, **kwargs):
    comment_text_changed = \
    (getattr(instance, '_former_comment') != getattr(instance, 'comment'))
    if created or comment_text_changed:
        print(instance)
        predictor = QualityPredictor()
        quality = predictor.make_prediction(str(instance))
        print(quality)
        save_quality(str(instance), quality)

def save_quality(comment, quality_classification):
    quality = Quality(
        comment_text=comment,
        quality=quality_classification
        )
    quality.save()
