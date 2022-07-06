from django.utils.translation import gettext_lazy as _

from adhocracy4 import phases

from . import apps
from . import models
from . import views


class AIDebatePhase(phases.PhaseContent):
    app = apps.Config.label
    phase = 'ai_debate'
    view = views.AISubjectListView

    name = _('AI Debate phase')
    description = _('AI Debate subjects.')
    module_name = _('subject ai debate')

    features = {
        'comment': (models.AISubject,)
    }


phases.content.register(AIDebatePhase())
