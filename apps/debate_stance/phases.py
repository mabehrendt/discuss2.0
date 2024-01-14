from django.utils.translation import gettext_lazy as _

from adhocracy4 import phases

from . import apps
from . import models
from . import views


class DebateStancePhase(phases.PhaseContent):
    app = apps.Config.label
    phase = 'debatestance'
    view = views.AIStanceSubjectListView

    name = _('Debate Stance phase')
    description = _('Debate Stance subjects.')
    module_name = _('subject debate stance')

    features = {
        'comment': (models.AIStanceSubject,)
    }


phases.content.register(DebateStancePhase())
