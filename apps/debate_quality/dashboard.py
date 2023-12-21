from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import DashboardComponent
from adhocracy4.dashboard import components

from . import exports
from . import models
from . import views


class AIQualitySubjectEditComponent(DashboardComponent):
    identifier = 'aiqualitysubject_edit'
    weight = 20
    label = _('AI Subjects')

    def is_effective(self, module):
        return module.blueprint_type == "QDB"

    def get_progress(self, module):
        if models.AIQualitySubject.objects.filter(module=module).exists():
            return 1, 1
        return 0, 1

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:aiqualitysubject-list',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r'^aiqualitysubjects/module/(?P<module_slug>[-\w_]+)/$',
                views.AIQualitySubjectListDashboardView.as_view(component=self),
                'aiqualitysubject-list'
            ),
            (
                r'^aiqualitysubjects/create/module/(?P<module_slug>[-\w_]+)/$',
                views.AIQualitySubjectCreateView.as_view(component=self),
                'aiqualitysubject-create'
            ),
            (
                r'^aiqualitysubjects/(?P<year>\d{4})-(?P<pk>\d+)/update/$',
                views.AIQualitySubjectUpdateView.as_view(component=self),
                'aiqualitysubject-update'
            ),
            (
                r'^aiqualitysubjects/(?P<year>\d{4})-(?P<pk>\d+)/delete/$',
                views.AIQualitySubjectDeleteView.as_view(component=self),
                'aiqualitysubject-delete'
            ),
        ]


components.register_module(AIQualitySubjectEditComponent())


class ExportAIQualitySubjectComponent(DashboardComponent):
    identifier = 'aiqualitysubject_export'
    weight = 50
    label = _('Export Excel')

    def is_effective(self, module):
        module_app = module.phases[0].content().app
        return (
            module_app == 'a4_candy_debate_quality'
            and not module.project.is_draft
            and not module.is_draft
        )

    def get_progress(self, module):
        return 0, 0

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:aiqualitysubject-export-module',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aiqualitysubjects/$',
             views.AIQualitySubjectDashboardExportView.as_view(),
             'aiqualitysubject-export-module',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aiqualitysubjects/aiqualitysubjects/$',
             exports.AIQualitySubjectExportView.as_view(),
             'aiqualitysubject-export',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/aiqualitysubjects/comments/$',
             exports.AIQualitySubjectCommentExportView.as_view(),
             'aiqualitysubject-comment-export',),
        ]


components.register_module(ExportAIQualitySubjectComponent())
