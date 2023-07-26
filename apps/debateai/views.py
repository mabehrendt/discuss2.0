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


class AISubjectListView(idea_views.AbstractIdeaListView,
                      DisplayProjectOrModuleMixin):
    model = models.AISubject
    filter_set = filters.AISubjectFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)


class AISubjectDetailView(idea_views.AbstractIdeaDetailView):
    model = models.AISubject
    permission_required = 'a4_candy_debateai.view_aisubject'


class AISubjectListDashboardView(ProjectMixin,
                               mixins.DashboardBaseMixin,
                               mixins.DashboardComponentMixin,
                               filter_views.FilteredListView):
    model = models.AISubject
    template_name = 'a4_candy_debateai/aisubject_dashboard_list.html'
    permission_required = 'a4projects.change_project'
    filter_set = filters.AISubjectCreateFilterSet

    def get_queryset(self):
        return super().get_queryset()\
            .filter(module=self.module)

    def get_permission_object(self):
        return self.project


class AISubjectCreateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaCreateView):
    model = models.AISubject
    form_class = forms.AISubjectForm
    permission_required = 'a4_candy_debateai.add_aisubject'
    template_name = 'a4_candy_debateai/aisubject_create_form.html'

    def get_success_url(self):
        return reverse(
            'a4dashboard:aisubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.module


class AISubjectUpdateView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentFormSignalMixin,
                        idea_views.AbstractIdeaUpdateView):
    model = models.AISubject
    form_class = forms.AISubjectForm
    permission_required = 'a4_candy_debateai.change_aisubject'
    template_name = 'a4_candy_debateai/aisubject_update_form.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:aisubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class AISubjectDeleteView(mixins.DashboardBaseMixin,
                        mixins.DashboardComponentMixin,
                        mixins.DashboardComponentDeleteSignalMixin,
                        idea_views.AbstractIdeaDeleteView):
    model = models.AISubject
    success_message = _('The ai subject has been deleted')
    permission_required = 'a4_candy_debateai.change_aisubject'
    template_name = 'a4_candy_debateai/aisubject_confirm_delete.html'

    @property
    def organisation(self):
        return self.project.organisation

    def get_success_url(self):
        return reverse(
            'a4dashboard:aisubject-list',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug
            })

    def get_permission_object(self):
        return self.get_object()


class AISubjectDashboardExportView(DashboardExportView):
    template_name = 'a4exports/export_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['aisubject_export'] = reverse(
            'a4dashboard:aisubject-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        context['comment_export'] = reverse(
            'a4dashboard:aisubject-comment-export',
            kwargs={
                'organisation_slug': self.module.project.organisation.slug,
                'module_slug': self.module.slug})
        return context

# Create your views here.
