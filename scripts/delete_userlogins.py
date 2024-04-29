import os
import sys
project_dir = "/home/maike/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django
django.setup()

import csv
from apps.users.models import UserLogins

from django.apps import apps

tables = [m._meta.db_table for c in apps.get_app_configs() for m in c.get_models()]
print(tables)

UserLogins.objects.all().delete()
