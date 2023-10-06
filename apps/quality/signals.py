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
    if created:
        predictor = QualityPredictor()
        prediction, quality = predictor.make_prediction(str(instance))
        save_quality(str(instance), prediction, quality, instance.content_type, instance.object_pk, instance.id, instance.creator)
    elif comment_text_changed:
        predictor = QualityPredictor()
        prediction, quality = predictor.make_prediction(str(instance))
        update_quality(str(instance), prediction, quality, instance.id)

def save_quality(comment, prediction, quality, content_type, object_id, comment_id, creator):
    quality = Quality(
        content_type=content_type,
        object_id=object_id,
        comment_text=comment,
        prediction=prediction,
        quality=quality,
        comment_id=comment_id,
        creator=creator
        )
    #update_comment(quality)
    quality.save()

def update_quality(comment, prediction, quality, comment_id):
    new_quality = Quality.objects.get(comment_id=comment_id)
    new_quality.prediction = prediction
    new_quality.quality = quality
    new_quality.comment_text = comment
    update_comment(new_quality)
    new_quality.save()

def update_comment(quality):
    comment = Comment.objects.get(id=quality.comment_id)
    comment.quality = quality.prediction
    comment.save()
