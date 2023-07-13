from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from adhocracy4.dashboard import DashboardComponent
from adhocracy4.dashboard import components

from . import views


class ParticipantsComponent(DashboardComponent):
    identifier = "participants"
    weight = 30
    label = _("Participants")

    def is_effective(self, project):
        return not project.is_draft and not project.is_public

    def get_base_url(self, project):
        return reverse(
            "a4dashboard:dashboard-participants-edit",
            kwargs={
                "organisation_slug": project.organisation.slug,
                "project_slug": project.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r"^projects/(?P<project_slug>[-\w_]+)/participants/$",
                views.DashboardProjectParticipantsView.as_view(component=self),
                "dashboard-participants-edit",
            )
        ]


class ModeratorsComponent(DashboardComponent):
    identifier = "moderators"
    weight = 32
    label = _("Moderators")

    def is_effective(self, project):
        return True

    def get_base_url(self, project):
        return reverse(
            "a4dashboard:dashboard-moderators-edit",
            kwargs={
                "organisation_slug": project.organisation.slug,
                "project_slug": project.slug,
            },
        )

    def get_urls(self):
        return [
            (
                r"^projects/(?P<project_slug>[-\w_]+)/moderators/$",
                views.DashboardProjectModeratorsView.as_view(component=self),
                "dashboard-moderators-edit",
            )
        ]


components.register_project(ModeratorsComponent())
components.register_project(ParticipantsComponent())
