from django.utils.translation import gettext_lazy as _

from adhocracy4 import phases

from . import apps
from . import models
from . import views


class DebateQualityRandomPhase(phases.PhaseContent):
    app = apps.Config.label
    phase = 'debatequalityrandom'
    view = views.QualityRandomSubjectListView

    name = _('Debate Quality Random phase')
    description = _('Debate Quality Random subjects.')
    module_name = _('subject debate quality random')

    features = {
        'comment': (models.QualityRandomSubject,)
    }


phases.content.register(DebateQualityRandomPhase())
