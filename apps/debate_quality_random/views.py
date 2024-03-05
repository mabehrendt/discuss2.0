from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import mixins
from adhocracy4.exports.views import DashboardExportView
from adhocracy4.filters import views as filter_views
from adhocracy4.projects.mixins import DisplayProjectOrModuleMixin
from adhocracy4.projects.mixins import ProjectMixin
from apps.ideas import views as idea_views

from . import filters
from . import forms
from . import models


class QualityRandomSubjectListView(idea_views.AbstractIdeaListView,
                      DisplayProjectOrModuleMixin):
    model = models.QualityRandomSubject
    filter_set = filters.QualityRandomSubjectFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)


class QualityRandomSubjectDetailView(idea_views.AbstractIdeaDetailView):
    model = models.QualityRandomSubject
    permission_required = 'a4_candy_debate_quality_random.view_qualityrandomsubject'


class QualityRandomSubjectListDashboardView(ProjectMixin,
                               mixins.DashboardBaseMixin,
                               mixins.DashboardComponentMixin,
                               filter_views.FilteredListView):
    model = models.QualityRandomSubject
    template_name = 'a4_candy_debate_quality_random/qualityrandomsubject_dashboard_list.html'
    permission_required = 'a4projects.change_project'
    filter_set = filters.QualityRandomSubjectCreateFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)

    def get_permission_object(self):
        return self.project


class QualityRandomSubjectCreateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaCreateView):
    model = models.QualityRandomSubject
    form_class = forms.QualityRandomSubjectForm
    permission_required = 'a4_candy_debate_quality_random.add_qualityrandomsubject'
    template_name = 'a4_candy_debate_quality_random/qualityrandomsubject_create_form.html'

    def get_success_url(self):
        return reverse(
            'a4dashboard:qualityrandomsubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.module


class QualityRandomSubjectUpdateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaUpdateView):
    model = models.QualityRandomSubject
    form_class = forms.QualityRandomSubjectForm
    permission_required = 'a4_candy_debate_quality_random.change_qualityrandomsubject'
    template_name = 'a4_candy_debate_quality_random/qualityrandomsubject_update_form.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:qualityrandomsubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class QualityRandomSubjectDeleteView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentDeleteSignalMixin,
                        idea_views.AbstractIdeaDeleteView):
    model = models.QualityRandomSubject
    success_message = _('The subject has been deleted')
    permission_required = 'a4_candy_debate_quality_random.change_qualityrandomsubject'
    template_name = 'a4_candy_debate_quality_random/qualityrandomsubject_confirm_delete.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:qualityrandomsubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class QualityRandomSubjectDashboardExportView(DashboardExportView):
    template_name = 'a4exports/export_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['qualityrandomsubject_export'] = reverse(
            'a4dashboard:qualityrandomsubject-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        context['comment_export'] = reverse(
            'a4dashboard:qualityrandomsubject-comment-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        return context

# Create your views here.
