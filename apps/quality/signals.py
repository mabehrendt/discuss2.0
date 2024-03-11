import logging
from django.conf import settings
from .apps import Config
from django.db.models import signals
from django.dispatch import receiver
from adhocracy4.comments.models import Comment

from .models import Quality

@receiver(signals.post_save, sender=Comment)
def get_quality(sender, instance, created, update_fields, **kwargs):
    comment_text_changed = (getattr(instance, '_former_comment') != getattr(instance, 'comment'))
    labels, prediction, quality  = Config.predictor.predict(str(instance))
    if created:
        save_quality(str(instance.comment), labels, prediction, quality, instance.content_type, instance.object_pk, instance.id, instance.creator)
    elif comment_text_changed:
        update_quality(str(instance.comment), labels, prediction, quality, instance.id)

def save_quality(comment, labels, prediction, quality, content_type, object_id, comment_id, creator):
    quality = Quality(
        content_type=content_type,
        object_id=object_id,
        comment_text=comment,
        prediction=prediction,
        labels=labels,
        quality=quality,
        comment_id=comment_id,
        creator=creator
        )
    #update_comment(quality)
    quality.save()

def update_quality(comment, labels, prediction, quality, comment_id):
    new_quality = Quality.objects.get(comment_id=comment_id)
    new_quality.prediction = prediction
    new_quality.labels = labels
    new_quality.quality = quality
    new_quality.comment_text = comment
    update_comment(new_quality)
    new_quality.save()

def update_comment(quality):
    comment = Comment.objects.get(id=quality.comment_id)
    comment.quality = quality.prediction
    comment.save()
