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
        print(question)
        print(instance)
        predictor = StancePredictor()
        stance = predictor.make_prediction(str(question), str(instance))
        print(stance)
        save_stance(str(instance), stance)

def save_stance(comment, stance_classification):
    stance = Stance(
        comment_text=comment,
        stance=stance_classification
        )
    stance.save()
