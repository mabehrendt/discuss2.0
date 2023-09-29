import json

from django import template
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ImproperlyConfigured
from django.utils.html import format_html

register = template.Library()

@register.simple_tag(takes_context=True)
def react_comments_async2(context, obj, with_categories=False):
    request = context["request"]
    user = context["user"].email
    debateQuestion = context["aisubject"].name
    print("USER: ", context["user"])
    print("DEBATEQUESTION: ", debateQuestion)
    print("STANCES: ", json.dumps(list(obj.stances.values("content_type", "object_id","comment_text", "stance","comment_id","creator"))))
    anchoredCommentId = request.GET.get("comment", "")
    contenttype = ContentType.objects.get_for_model(obj)

    with_categories = bool(with_categories)

    comment_category_choices = {}
    if with_categories:
        comment_category_choices = getattr(settings, "A4_COMMENT_CATEGORIES", None)
        if comment_category_choices:
            comment_category_choices = dict(
                (x, str(y)) for x, y in comment_category_choices
            )
        else:
            raise ImproperlyConfigured("set A4_COMMENT_CATEGORIES in settings")

    use_moderator_marked = getattr(settings, "A4_COMMENTS_USE_MODERATOR_MARKED", False)
    quality = list(obj.qualities.values("content_type", "object_id", "comment_text", "prediction", "quality","comment_id","creator"))

    attributes = {
        "subjectType": contenttype.pk,
        "subjectId": obj.pk,
        "debateQuestion": debateQuestion,
        "stances": list(obj.stances.values("content_type", "object_id","comment_text", "stance","comment_id","creator")),
        #"quality": quality,
        "commentCategoryChoices": comment_category_choices,
        "anchoredCommentId": anchoredCommentId,
        "withCategories": with_categories,
        "useModeratorMarked": use_moderator_marked,
        "user": user
    }

    return format_html(
        '<div data-a4-widget="comment_async2" data-attributes="{attributes}"></div>',
        attributes=json.dumps(attributes),
    )
