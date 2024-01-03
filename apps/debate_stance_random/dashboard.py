from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import DashboardComponent
from adhocracy4.dashboard import components

from . import exports
from . import models
from . import views


class StanceRandomSubjectEditComponent(DashboardComponent):
    identifier = 'stancerandomsubject_edit'
    weight = 20
    label = _('Stance Random Subjects')

    def is_effective(self, module):
        return module.blueprint_type == "SRDB"

    def get_progress(self, module):
        if models.StanceRandomSubject.objects.filter(module=module).exists():
            return 1, 1
        return 0, 1

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:stancerandomsubject-list',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r'^stancerandomsubjects/module/(?P<module_slug>[-\w_]+)/$',
                views.StanceRandomSubjectListDashboardView.as_view(component=self),
                'stancerandomsubject-list'
            ),
            (
                r'^stancerandomsubjects/create/module/(?P<module_slug>[-\w_]+)/$',
                views.StanceRandomSubjectCreateView.as_view(component=self),
                'stancerandomsubject-create'
            ),
            (
                r'^stancerandomsubjects/(?P<year>\d{4})-(?P<pk>\d+)/update/$',
                views.StanceRandomSubjectUpdateView.as_view(component=self),
                'stancerandomsubject-update'
            ),
            (
                r'^stancerandomsubjects/(?P<year>\d{4})-(?P<pk>\d+)/delete/$',
                views.StanceRandomSubjectDeleteView.as_view(component=self),
                'stancerandomsubject-delete'
            ),
        ]


components.register_module(StanceRandomSubjectEditComponent())


class ExportStanceRandomSubjectComponent(DashboardComponent):
    identifier = 'stancerandomsubject_export'
    weight = 50
    label = _('Export Excel')

    def is_effective(self, module):
        module_app = module.phases[0].content().app
        return (
            module_app == 'a4_candy_debate_stance_random'
            and not module.project.is_draft
            and not module.is_draft
        )

    def get_progress(self, module):
        return 0, 0

    def get_base_url(self, module):
        return reverse(
            'a4dashboard:stancerandomsubject-export-module',
            kwargs={
                'organisation_slug': module.project.organisation.slug,
                'module_slug': module.slug,
            },
        )

    def get_urls(self):
        return [
            (r'^modules/(?P<module_slug>[-\w_]+)/export/stancerandomsubjects/$',
             views.StanceRandomSubjectDashboardExportView.as_view(),
             'stancerandomsubject-export-module',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/stancerandomsubjects/stancerandomsubjects/$',
             exports.StanceRandomSubjectExportView.as_view(),
             'stancerandomsubject-export',),
            (r'^modules/(?P<module_slug>[-\w_]+)/export/stancerandomsubjects/comments/$',
             exports.StanceRandomSubjectCommentExportView.as_view(),
             'stancerandomsubject-comment-export',),
        ]


components.register_module(ExportStanceRandomSubjectComponent())
