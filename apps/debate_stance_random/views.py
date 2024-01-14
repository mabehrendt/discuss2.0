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


class StanceRandomSubjectListView(idea_views.AbstractIdeaListView,
                      DisplayProjectOrModuleMixin):
    model = models.StanceRandomSubject
    filter_set = filters.StanceRandomSubjectFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)


class StanceRandomSubjectDetailView(idea_views.AbstractIdeaDetailView):
    model = models.StanceRandomSubject
    permission_required = 'a4_candy_debate_stance_random.view_stancerandomsubject'


class StanceRandomSubjectListDashboardView(ProjectMixin,
                               mixins.DashboardBaseMixin,
                               mixins.DashboardComponentMixin,
                               filter_views.FilteredListView):
    model = models.StanceRandomSubject
    template_name = 'a4_candy_debate_stance_random/stancerandomsubject_dashboard_list.html'
    permission_required = 'a4projects.change_project'
    filter_set = filters.StanceRandomSubjectCreateFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)

    def get_permission_object(self):
        return self.project


class StanceRandomSubjectCreateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaCreateView):
    model = models.StanceRandomSubject
    form_class = forms.StanceRandomSubjectForm
    permission_required = 'a4_candy_debate_stance_random.add_stancerandomsubject'
    template_name = 'a4_candy_debate_stance_random/stancerandomsubject_create_form.html'

    def get_success_url(self):
        return reverse(
            'a4dashboard:stancerandomsubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.module


class StanceRandomSubjectUpdateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaUpdateView):
    model = models.StanceRandomSubject
    form_class = forms.StanceRandomSubjectForm
    permission_required = 'a4_candy_debate_stance_random.change_stancerandomsubject'
    template_name = 'a4_candy_debate_stance_random/stancerandomsubject_update_form.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:stancerandomsubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class StanceRandomSubjectDeleteView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentDeleteSignalMixin,
                        idea_views.AbstractIdeaDeleteView):
    model = models.StanceRandomSubject
    success_message = _('The ai subject has been deleted')
    permission_required = 'a4_candy_debate_stance_random.change_stancerandomsubject'
    template_name = 'a4_candy_debate_stance_random/stancerandomsubject_confirm_delete.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:stancerandomsubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class StanceRandomSubjectDashboardExportView(DashboardExportView):
    template_name = 'a4exports/export_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['stancerandomsubject_export'] = reverse(
            'a4dashboard:stancerandomsubject-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        context['comment_export'] = reverse(
            'a4dashboard:stancerandomsubject-comment-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        return context

# Create your views here.
