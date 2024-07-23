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

tables = [m._meta.db_table for c in apps.get_app_configs() for m in c.get_models()]
print(tables)


comments = Comment.objects.all()

# Step 2: Use a dictionary to track occurrences of each comment text
comment_dict = defaultdict(list)
for comment in comments:
    cleaned_comment = comment.comment.strip().lower()
    comment_dict[cleaned_comment].append(comment)

# Step 3: Identify and print duplicate comments
duplicates_found = False
for comment_text, instances in comment_dict.items():
    if len(instances) > 1:
        duplicates_found = True
        print(f'"{comment_text}" appears {len(instances)} times:')
        for instance in instances:
            print(f' - ID: {instance.id}, Created: {instance.created}, Creator: {instance.creator}, CT: {instance.content_type}, PK: {instance.object_pk}')

if not duplicates_found:
    print("No duplicate comments found.")