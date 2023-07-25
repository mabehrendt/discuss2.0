from django.utils.translation import gettext_lazy as _

from adhocracy4 import phases

from . import apps
from . import models
from . import views


class DebateAIPhase(phases.PhaseContent):
    app = apps.Config.label
    phase = 'debateai'
    view = views.AISubjectListView

    name = _('Debate AI phase')
    description = _('Debate AI subjects.')
    module_name = _('subject debate ai')

    features = {
        'comment': (models.AISubject,)
    }


phases.content.register(DebateAIPhase())
