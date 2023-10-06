from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import DashboardComponent
from adhocracy4.dashboard import components

from . import exports
from . import models
from . import views


class AISubjectEditComponent(DashboardComponent):
    identifier = 'aisubject_edit'
    weight = 20
    label = _('AISubjects')

    def is_effective(self, module):
        return module.blueprint_type == "DB"

    def get_progress(self, module):
        if models.AISubject.objects.filter(module=module).exists():
            return 1, 1
        return 0, 1

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:aisubject-list',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r'^aisubjects/module/(?P<module_slug>[-\w_]+)/$',
                views.AISubjectListDashboardView.as_view(component=self),
                'aisubject-list'
            ),
            (
                r'^aisubjects/create/module/(?P<module_slug>[-\w_]+)/$',
                views.AISubjectCreateView.as_view(component=self),
                'aisubject-create'
            ),
            (
                r'^aisubjects/(?P<year>\d{4})-(?P<pk>\d+)/update/$',
                views.AISubjectUpdateView.as_view(component=self),
                'aisubject-update'
            ),
            (
                r'^aisubjects/(?P<year>\d{4})-(?P<pk>\d+)/delete/$',
                views.AISubjectDeleteView.as_view(component=self),
                'aisubject-delete'
            ),
        ]


components.register_module(AISubjectEditComponent())


class ExportAISubjectComponent(DashboardComponent):
    identifier = 'aisubject_export'
    weight = 50
    label = _('Export Excel')

    def is_effective(self, module):
        module_app = module.phases[0].content().app
        return (
            module_app == 'a4_candy_debateai'
            and not module.project.is_draft
            and not module.is_draft
        )

    def get_progress(self, module):
        return 0, 0

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:aisubject-export-module',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aisubjects/$',
             views.AISubjectDashboardExportView.as_view(),
             'aisubject-export-module',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aisubjects/aisubjects/$',
             exports.AISubjectExportView.as_view(),
             'aisubject-export',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aisubjects/comments/$',
             exports.AISubjectCommentExportView.as_view(),
             'aisubject-comment-export',),
        ]


components.register_module(ExportAISubjectComponent())
