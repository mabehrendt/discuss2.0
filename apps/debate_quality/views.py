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


class AIQualitySubjectListView(idea_views.AbstractIdeaListView,
                      DisplayProjectOrModuleMixin):
    model = models.AIQualitySubject
    filter_set = filters.AIQualitySubjectFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)


class AIQualitySubjectDetailView(idea_views.AbstractIdeaDetailView):
    model = models.AIQualitySubject
    permission_required = 'a4_candy_debate_quality.view_aiqualitysubject'


class AIQualitySubjectListDashboardView(ProjectMixin,
                               mixins.DashboardBaseMixin,
                               mixins.DashboardComponentMixin,
                               filter_views.FilteredListView):
    model = models.AIQualitySubject
    template_name = 'a4_candy_debate_quality/aiqualitysubject_dashboard_list.html'
    permission_required = 'a4projects.change_project'
    filter_set = filters.AIQualitySubjectCreateFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)

    def get_permission_object(self):
        return self.project


class AIQualitySubjectCreateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaCreateView):
    model = models.AIQualitySubject
    form_class = forms.AIQualitySubjectForm
    permission_required = 'a4_candy_debate_quality.add_aiqualitysubject'
    template_name = 'a4_candy_debate_quality/aiqualitysubject_create_form.html'

    def get_success_url(self):
        return reverse(
            'a4dashboard:aiqualitysubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.module


class AIQualitySubjectUpdateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaUpdateView):
    model = models.AIQualitySubject
    form_class = forms.AIQualitySubjectForm
    permission_required = 'a4_candy_debate_quality.change_aiqualitysubject'
    template_name = 'a4_candy_debate_quality/aiqualitysubject_update_form.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:aiqualitysubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class AIQualitySubjectDeleteView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentDeleteSignalMixin,
                        idea_views.AbstractIdeaDeleteView):
    model = models.AIQualitySubject
    success_message = _('The ai subject has been deleted')
    permission_required = 'a4_candy_debate_quality.change_aiqualitysubject'
    template_name = 'a4_candy_debate_quality/aiqualitysubject_confirm_delete.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:aiqualitysubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class AIQualitySubjectDashboardExportView(DashboardExportView):
    template_name = 'a4exports/export_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['aiqualitysubject_export'] = reverse(
            'a4dashboard:aiqualitysubject-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        context['comment_export'] = reverse(
            'a4dashboard:aiqualitysubject-comment-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        return context

# Create your views here.
