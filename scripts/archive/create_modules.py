import os
import sys
project_dir = "/home/maike/Dokumente/Uni/Repositories/discuss2.0"
sys.path.append(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'adhocracy-plus.config.settings.build'
import django
django.setup()

from adhocracy4.modules.models import Module
from adhocracy4.dashboard import signals
from apps.debate.models import Subject
from apps.debate.phases import DebatePhase
from apps.debate_quality.models import AIQualitySubject
from apps.debate_quality.phases import DebateQualityPhase
from apps.debate_quality_random.models import QualityRandomSubject
from apps.debate_quality_random.phases import DebateQualityRandomPhase
from apps.debate_stance.models import AIStanceSubject
from apps.debate_stance.phases import DebateStancePhase
from apps.debate_stance_random.models import StanceRandomSubject
from apps.debate_stance_random.phases import DebateStanceRandomPhase
from apps.polls_react import phases as poll_phases
from apps.users.models import User
from django.contrib.auth import authenticate, login, get_user
# Simulate login
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory

import csv

file = 'import_modules.csv'

data = csv.reader(open(file), delimiter=",")
# skip header
next(data, None)
# Create a request factory instance
request_factory = RequestFactory()
request = request_factory.get('/')
user = authenticate(username="maike", password="admin")
print(user)
if user is not None:
    # Attach session to the request
    middleware = SessionMiddleware()
    middleware.process_request(request)
    request.session.save()

    # Attach user to the request
    request.user = user
    print(request.user)
    login(request, user)

for row in data:
    Mod = Module()
    Mod.name = row[0]
    Mod.description = row[1]
    Mod.project_id = row[2]
    Mod.weight = row[3]
    Mod.is_draft = 0
    Mod.blueprint_type = row[4]
    Mod.save()
    signals.module_created.send(sender=None, module=Mod, user=request.user)
    if Mod.blueprint_type == 'DB':
        Sub = Subject()
        Phase = DebatePhase()
    elif Mod.blueprint_type == 'QDB':
        Sub = AIQualitySubject()
        Phase = DebateQualityPhase()
    elif Mod.blueprint_type == 'QRDB':
        Sub = QualityRandomSubject()
        Phase = DebateQualityRandomPhase()
    elif Mod.blueprint_type == 'SDB':
        Sub = AIStanceSubject()
        Phase = DebateStancePhase()
    elif Mod.blueprint_type == 'SRDB':
        Sub = StanceRandomSubject()
        Phase = DebateStanceRandomPhase()
    # add poll
    # elif Mod.blueprint_type == 'PO':
        # TODO
    Sub.name = row[5]
    Sub.description = row[6]
    Sub.save()
    Phase.start_date = row[7]
    Phase.end_date = row[8]
    Phase.module = Mod.id
    Phase.weight = 0
    Phase.save()

