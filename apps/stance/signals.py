import logging
from django.conf import settings
from django.db.models import signals
from django.dispatch import receiver
from ai.stance_detection import StancePredictor

from adhocracy4.comments.models import Comment

from .models import Stance

@receiver(signals.post_save, sender=Comment)
def get_stance(sender, instance, created, update_fields, **kwargs):

    comment_text_changed = \
    (getattr(instance, '_former_comment') != getattr(instance, 'comment'))
    if created or comment_text_changed:
        question = getattr(instance, 'content_object')
        print("SQUESTION: ", question)
        print("SINSTANCE: ", instance)
        predictor = StancePredictor()
        stance = predictor.make_prediction(str(question), str(instance))
        print("SSTANCE: ", stance)
        print("SPK: ", instance.id)
        save_stance(str(instance), stance, instance.content_type, instance.object_pk, instance.id, instance.creator)

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
