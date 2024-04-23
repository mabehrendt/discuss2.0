import os
import sys
project_dir = "/home/maike/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django
django.setup()

import csv
from apps.stance.models import UserStance

from django.apps import apps

tables = [m._meta.db_table for c in apps.get_app_configs() for m in c.get_models()]
print(tables)

print(UserStance.objects.all())

all_userstances = UserStance.objects.all()

for userstance in all_userstances:
    print("CONTENT_TYPE: ", userstance.content_type)
    print("OBJECT_ID: ", userstance.object_id)
    print("USER_STANCE: ", userstance.user_stance)
    print("QUESTIONBOX_SHOWN: ", userstance.questionbox_shown)
    print("QUESTIONBOX_CLICKED: ", userstance.questionbox_clicked)
    print("CREATOR: ", userstance.creator)
    print("CREATOR_ID: ", userstance.creator_id)
    print("\n")
