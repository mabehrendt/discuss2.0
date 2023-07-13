from django import forms

from apps.mapideas.forms import MapIdeaForm

from . import models


class ProposalForm(MapIdeaForm):
    class Meta:
        model = models.Proposal
        fields = [
            "name",
            "description",
            "image",
            "category",
            "labels",
            "budget",
            "point",
            "point_label",
        ]


class ProposalModerateForm(forms.ModelForm):
    class Meta:
        model = models.Proposal
        fields = ["moderator_status", "is_archived"]
