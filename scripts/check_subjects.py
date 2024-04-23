import os
import sys
project_dir = "/home/maike/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django
django.setup()

import csv
from apps.debate_stance.models import AIStanceSubject

from django.apps import apps

tables = [m._meta.db_table for c in apps.get_app_configs() for m in c.get_models()]
print(tables)

all_aistancesubjects = AIStanceSubject.objects.all()

for subject in all_aistancesubjects:
    print("SLUG: ", subject.slug)
    print("NAME: ", subject.name)
    print("DESCRIPTION: ", subject.description)
    print("STANCE: ", subject.stances)
    print("COMMENTS: ", subject.comments)
    print("REFERENCE NUMBER: ", subject.reference_number)
    print("\n")
