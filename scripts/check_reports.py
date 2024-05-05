import os
import sys
project_dir = "/home/maike/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django
django.setup()

import csv
from adhocracy4.reports.models import Report
from adhocracy4.comments.models import Comment

all_reports = Report.objects.all()

for report in all_reports:
    print("GEMELDET: ", report.created) 
    print("NACHRICHT: ", report.description)
    print("COMMENT: ", Comment.objects.get(id=report.object_pk))
    print("\n")
