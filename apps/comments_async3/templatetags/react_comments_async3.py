import json

from django import template
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ImproperlyConfigured
from django.utils.html import format_html

from utils.count_logins import count_login

register = template.Library()

@register.simple_tag(takes_context=True)
def react_comments_async3(context, obj, with_categories=False):
    request = context["request"]
    print("REQUEST: ", context)
    if context["user"].is_authenticated:
        user = context["user"].email
        user_authenticated = context["user"].is_authenticated
    else:
        user = None
        user_authenticated = context["user"].is_authenticated

    if user_authenticated:
        count_login(user)
        #user_email = context["user"].email
        #user_login = User.objects.get(email=user_email)

        #if not user_login.userlogins_set.filter(date=timezone.now().date()).exists():
        #    UserLogins.objects.create(user=user_login, date=timezone.now().date())

        #all_user_logins = UserLogins.objects.all()
        #for user_login in all_user_logins:
        #    print(user_login.user, user_login.date)


    
    debateStanceQuestion = context["aistancesubject"].name
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
        "debateStanceQuestion": debateStanceQuestion,
        "stances": list(obj.stances.values("content_type", "object_id","comment_text", "stance","comment_id","creator")),
        "commentCategoryChoices": comment_category_choices,
        "anchoredCommentId": anchoredCommentId,
        "withCategories": with_categories,
        "useModeratorMarked": use_moderator_marked,
        "user": {"user_auth": user_authenticated, "user": user}
    }

    return format_html(
        '<div data-a4-widget="comment_async3" data-attributes="{attributes}"></div>',
        attributes=json.dumps(attributes),
    )
