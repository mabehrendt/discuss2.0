from django.utils.translation import gettext_lazy as _

from adhocracy4 import phases

from . import apps
from . import models
from . import views


class DebateQualityPhase(phases.PhaseContent):
    app = apps.Config.label
    phase = 'debatequality'
    view = views.AIQualitySubjectListView

    name = _('Debate Quality phase')
    description = _('Debate Quality subjects.')
    module_name = _('subject debate quality')

    features = {
        'comment': (models.AIQualitySubject,)
    }


phases.content.register(DebateQualityPhase())
