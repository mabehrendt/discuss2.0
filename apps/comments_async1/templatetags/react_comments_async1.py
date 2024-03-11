import json

from django import template
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ImproperlyConfigured
from django.utils.html import format_html

register = template.Library()

@register.simple_tag(takes_context=True)
def react_comments_async1(context, obj, with_categories=False):
    request = context["request"]
    if context["user"].is_authenticated:
        user = context["user"].email
        user_authenticated = context["user"].is_authenticated
    else:
        user = None
        user_authenticated = context["user"].is_authenticated
    debateQualityQuestion = context["aiqualitysubject"].name
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

    attributes = {
        "subjectType": contenttype.pk,
        "subjectId": obj.pk,
        "debateQualityQuestion": debateQualityQuestion,
        "commentCategoryChoices": comment_category_choices,
        "anchoredCommentId": anchoredCommentId,
        "withCategories": with_categories,
        "useModeratorMarked": use_moderator_marked,
        "user": {"user_auth": user_authenticated, "user": user}
    }

    return format_html(
        '<div data-a4-widget="comment_async1" data-attributes="{attributes}"></div>',
        attributes=json.dumps(attributes),
    )
