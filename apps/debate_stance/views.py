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


class AIStanceSubjectListView(idea_views.AbstractIdeaListView,
                      DisplayProjectOrModuleMixin):
    model = models.AIStanceSubject
    filter_set = filters.AIStanceSubjectFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)


class AIStanceSubjectDetailView(idea_views.AbstractIdeaDetailView):
    model = models.AIStanceSubject
    permission_required = 'a4_candy_debate_stance.view_aistancesubject'


class AIStanceSubjectListDashboardView(ProjectMixin,
                               mixins.DashboardBaseMixin,
                               mixins.DashboardComponentMixin,
                               filter_views.FilteredListView):
    model = models.AIStanceSubject
    template_name = 'a4_candy_debate_stance/aistancesubject_dashboard_list.html'
    permission_required = 'a4projects.change_project'
    filter_set = filters.AIStanceSubjectCreateFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)

    def get_permission_object(self):
        return self.project


class AIStanceSubjectCreateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaCreateView):
    model = models.AIStanceSubject
    form_class = forms.AIStanceSubjectForm
    permission_required = 'a4_candy_debate_stance.add_aistancesubject'
    template_name = 'a4_candy_debate_stance/aistancesubject_create_form.html'

    def get_success_url(self):
        return reverse(
            'a4dashboard:aistancesubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.module


class AIStanceSubjectUpdateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaUpdateView):
    model = models.AIStanceSubject
    form_class = forms.AIStanceSubjectForm
    permission_required = 'a4_candy_debate_stance.change_aistancesubject'
    template_name = 'a4_candy_debate_stance/aistancesubject_update_form.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:aistancesubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class AIStanceSubjectDeleteView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentDeleteSignalMixin,
                        idea_views.AbstractIdeaDeleteView):
    model = models.AIStanceSubject
    success_message = _('The ai subject has been deleted')
    permission_required = 'a4_candy_debate_stance.change_aistancesubject'
    template_name = 'a4_candy_debate_stance/aistancesubject_confirm_delete.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:aistancesubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class AIStanceSubjectDashboardExportView(DashboardExportView):
    template_name = 'a4exports/export_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['aistancesubject_export'] = reverse(
            'a4dashboard:aistancesubject-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        context['comment_export'] = reverse(
            'a4dashboard:aistancesubject-comment-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        return context

# Create your views here.
