import json

from django import template
from django.utils.html import format_html

register = template.Library()

from utils.count_logins import count_login


@register.simple_tag(takes_context=True)
def react_polls2(context, poll):
    if context["user"].is_authenticated:
        user = context["user"].email
        user_authenticated = context["user"].is_authenticated
    else:
        user = None
        user_authenticated = context["user"].is_authenticated

    if user_authenticated:
        count_login(user)

    return format_html(
        '<div data-a4-widget="react_polls2" data-poll-id="{pollId}"></div>',
        pollId=poll.pk,
    )


@register.simple_tag
def react_poll_form(poll, reload_on_success=False):
    reload_on_success = json.dumps(reload_on_success)

    return format_html(
        (
            '<div data-a4-widget="react_poll_management" data-poll-id="{pollId}" '
            ' data-reloadOnSuccess="{reload_on_success}">'
            "</div>"
        ),
        pollId=poll.pk,
        reload_on_success=reload_on_success,
    )
