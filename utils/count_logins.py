import json

from django import template
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ImproperlyConfigured
from django.utils.html import format_html
from django.utils import timezone

from apps.users.models import User
from apps.users.models import UserLogins


def count_login(user_email):
    user_login = User.objects.get(email=user_email)

    if not user_login.userlogins_set.filter(date=timezone.now().date()).exists():
        UserLogins.objects.create(user=user_login, date=timezone.now().date())

    all_user_logins = UserLogins.objects.all()
    for user_login in all_user_logins:
        print(user_login.user, user_login.date)