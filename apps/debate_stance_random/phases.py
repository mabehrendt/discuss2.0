from django.utils.translation import gettext_lazy as _

from adhocracy4 import phases

from . import apps
from . import models
from . import views


class DebateStanceRandomPhase(phases.PhaseContent):
    app = apps.Config.label
    phase = 'debatestancerandom'
    view = views.StanceRandomSubjectListView

    name = _('Debate Stance Random phase')
    description = _('Debate Stance Random subjects.')
    module_name = _('subject debate stance random')

    features = {
        'comment': (models.StanceRandomSubject,)
    }


phases.content.register(DebateStanceRandomPhase())
