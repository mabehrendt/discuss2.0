from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import DashboardComponent
from adhocracy4.dashboard import components

from . import exports
from . import models
from . import views


class QualityRandomSubjectEditComponent(DashboardComponent):
    identifier = 'qualityrandomsubject_edit'
    weight = 20
    label = _('Subjects')

    def is_effective(self, module):
        return module.blueprint_type == "QRDB"

    def get_progress(self, module):
        if models.QualityRandomSubject.objects.filter(module=module).exists():
            return 1, 1
        return 0, 1

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:qualityrandomsubject-list',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r'^qualityrandomsubjects/module/(?P<module_slug>[-\w_]+)/$',
                views.QualityRandomSubjectListDashboardView.as_view(component=self),
                'qualityrandomsubject-list'
            ),
            (
                r'^qualityrandomsubjects/create/module/(?P<module_slug>[-\w_]+)/$',
                views.QualityRandomSubjectCreateView.as_view(component=self),
                'qualityrandomsubject-create'
            ),
            (
                r'^aiqualitysubjects/(?P<year>\d{4})-(?P<pk>\d+)/update/$',
                views.QualityRandomSubjectUpdateView.as_view(component=self),
                'qualityrandomsubject-update'
            ),
            (
                r'^qualityrandomsubjects/(?P<year>\d{4})-(?P<pk>\d+)/delete/$',
                views.QualityRandomSubjectDeleteView.as_view(component=self),
                'qualityrandomsubject-delete'
            ),
        ]


components.register_module(QualityRandomSubjectEditComponent())


class ExportQualityRandomSubjectComponent(DashboardComponent):
    identifier = 'qualityrandomsubject_export'
    weight = 50
    label = _('Export Excel')

    def is_effective(self, module):
        module_app = module.phases[0].content().app
        return (
            module_app == 'a4_candy_debate_quality_random'
            and not module.project.is_draft
            and not module.is_draft
        )

    def get_progress(self, module):
        return 0, 0

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:qualityrandomsubject-export-module',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (r'^modules/(?P<module_slug>[-\w_]+)/export/qualityrandomsubjects/$',
             views.QualityRandomSubjectDashboardExportView.as_view(),
             'qualityrandomsubject-export-module',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/qualityrandomsubjects/qualityrandomsubjects/$',
             exports.QualityRandomSubjectExportView.as_view(),
             'qualityrandomsubject-export',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/qualityrandomsubjects/comments/$',
             exports.QualityRandomSubjectCommentExportView.as_view(),
             'qualityrandomsubject-comment-export',),
        ]


components.register_module(ExportQualityRandomSubjectComponent())
