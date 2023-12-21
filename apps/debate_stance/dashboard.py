from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import DashboardComponent
from adhocracy4.dashboard import components

from . import exports
from . import models
from . import views


class AIStanceSubjectEditComponent(DashboardComponent):
    identifier = 'aistancesubject_edit'
    weight = 20
    label = _('AI Subjects')

    def is_effective(self, module):
        return module.blueprint_type == "SDB"

    def get_progress(self, module):
        if models.AIStanceSubject.objects.filter(module=module).exists():
            return 1, 1
        return 0, 1

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:aistancesubject-list',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r'^aistancesubjects/module/(?P<module_slug>[-\w_]+)/$',
                views.AIStanceSubjectListDashboardView.as_view(component=self),
                'aistancesubject-list'
            ),
            (
                r'^aistancesubjects/create/module/(?P<module_slug>[-\w_]+)/$',
                views.AIStanceSubjectCreateView.as_view(component=self),
                'aistancesubject-create'
            ),
            (
                r'^aistancesubjects/(?P<year>\d{4})-(?P<pk>\d+)/update/$',
                views.AIStanceSubjectUpdateView.as_view(component=self),
                'aistancesubject-update'
            ),
            (
                r'^aistancesubjects/(?P<year>\d{4})-(?P<pk>\d+)/delete/$',
                views.AIStanceSubjectDeleteView.as_view(component=self),
                'aistancesubject-delete'
            ),
        ]


components.register_module(AIStanceSubjectEditComponent())


class ExportAIStanceSubjectComponent(DashboardComponent):
    identifier = 'aistancesubject_export'
    weight = 50
    label = _('Export Excel')

    def is_effective(self, module):
        module_app = module.phases[0].content().app
        return (
            module_app == 'a4_candy_debate_stance'
            and not module.project.is_draft
            and not module.is_draft
        )

    def get_progress(self, module):
        return 0, 0

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:aistancesubject-export-module',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aistancesubjects/$',
             views.AIStanceSubjectDashboardExportView.as_view(),
             'aistancesubject-export-module',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aistancesubjects/aistancesubjects/$',
             exports.AIStanceSubjectExportView.as_view(),
             'aistancesubject-export',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aistancesubjects/comments/$',
             exports.AIStanceSubjectCommentExportView.as_view(),
             'aistancesubject-comment-export',),
        ]


components.register_module(ExportAIStanceSubjectComponent())
