import os
import sys
project_dir = "/home/maike/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django
django.setup()

from django.contrib.auth import authenticate
from django.contrib import admin
from django.contrib.auth.models import User

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.conf import settings
from datetime import datetime, timezone

from allauth.account.models import EmailAddress
from apps.organisations.models import Member

import csv

User = get_user_model()
print(User)

file = '.scripts/import_users.csv'

data = csv.reader(open(file), delimiter=",")
# skip header
next(data, None)
for row in data:
    Post=User()
    Post.password = make_password(row[2])
    Post.is_superuser = "0"
    Post.username = row[3]
    Post.bilendi_id = row[1]
    Post.email = row[4]
    Post.date_joined = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M:%S")
    Post.get_notifications = "1"
    Post.get_newsletters = "0"
    Post.is_staff = "1"
    Post.is_active = "1"
    Post.language = "de"
    Post.save()
    Mail=EmailAddress()
    Mail.verified="1"
    Mail.primary="1"
    Mail.user_id=Post.id
    Mail.email=Post.email
    Mail.save()
    # change organisation id here
    Member.objects.create(member_id = Post.id, organisation_id = 3)
    


