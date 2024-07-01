import logging
from django.conf import settings
from django.db.models import signals
from django.dispatch import receiver
from ai.stance_detection import StancePredictor

from adhocracy4.comments.models import Comment

from .models import Stance

@receiver(signals.post_save, sender=Comment)
def get_stance(sender, instance, created, update_fields, **kwargs):
    print("TEST SIGNAL")
    print(instance.__dict__)
    print(str(instance.comment))
    comment_text_changed = (getattr(instance, '_former_comment') != getattr(instance, 'comment'))
    question = getattr(instance, 'content_object')
    predictor = StancePredictor()
    stance = predictor.make_prediction(str(question), str(instance.comment))

    if created:
        save_stance(str(instance.comment), stance, instance.content_type, instance.object_pk, instance.id, instance.creator, instance.is_blocked, instance.is_removed, instance.is_censored)
    elif comment_text_changed:
        update_stance(str(instance.comment), stance, instance.id, instance.is_blocked, instance.is_removed, instance.is_censored)

@receiver(signals.post_delete, sender=Comment)
def delete_stance(sender, instance, **kwargs):
    quality = Stance.objects.get(comment_id=instance.id)
    quality.delete()

def save_stance(comment, stance_classification, content_type, object_id, comment_id, creator, is_blocked, is_removed, is_censored):
    stance = Stance(
        content_type=content_type,
        object_id=object_id,
        comment_text=comment,
        stance=stance_classification,
        comment_id=comment_id,
        creator=creator,
        is_blocked=is_blocked,
        is_removed=is_removed,
        is_censored=is_censored
    )
    stance.save()

def update_stance(comment, stance_classification, comment_id, is_blocked, is_removed, is_censored):
    new_stance = Stance.objects.get(comment_id=comment_id)
    new_stance.stance = stance_classification
    new_stance.comment_text = comment
    new_stance.is_blocked = is_blocked
    new_stance.is_removed = is_removed
    new_stance.is_censored = is_censored
    new_stance.save()
