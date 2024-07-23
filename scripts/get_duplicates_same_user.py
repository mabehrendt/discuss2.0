import os
import sys
project_dir = "/Users/stefansylviuswagner/Documents/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django

django.setup()

import csv
from adhocracy4.comments.models import Comment

from django.apps import apps
from collections import defaultdict
from django.utils import timezone
from datetime import timedelta

tables = [m._meta.db_table for c in apps.get_app_configs() for m in c.get_models()]
print(tables)

# Step 1: Get the current date
today = timezone.now().date()

# Step 2: Retrieve all comments for today
comments = Comment.objects.filter(created__date=today)

# Step 3: Use a nested dictionary to track occurrences of each comment text by user
comment_dict = defaultdict(lambda: defaultdict(list))
for comment in comments:
    cleaned_comment = comment.comment.strip().lower()
    user = comment.creator  # Assuming 'creator' is the field name for the user
    comment_dict[user][cleaned_comment].append(comment)

# Step 4: Identify and print duplicate comments by the same user
duplicates_found = False
for user, user_comments in comment_dict.items():
    for comment_text, instances in user_comments.items():
        if len(instances) > 1:
            duplicates_found = True
            print(f'User: {user} - "{comment_text}" appears {len(instances)} times today:')
            for instance in instances:
                print(f' - ID: {instance.id}, Created: {instance.created}, CT: {instance.content_type}, PK: {instance.object_pk}')

if not duplicates_found:
    print("No duplicate comments found for today.")