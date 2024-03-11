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
        save_stance(str(instance.comment), stance, instance.content_type, instance.object_pk, instance.id, instance.creator)
    elif comment_text_changed:
        update_stance(str(instance.comment), stance, instance.id)

def save_stance(comment, stance_classification, content_type, object_id, comment_id, creator):
    stance = Stance(
        content_type=content_type,
        object_id=object_id,
        comment_text=comment,
        stance=stance_classification,
        comment_id=comment_id,
        creator=creator
    )
    stance.save()

def update_stance(comment, stance_classification, comment_id):
    new_stance = Stance.objects.get(comment_id=comment_id)
    new_stance.stance = stance_classification
    new_stance.comment_text = comment
    new_stance.save()