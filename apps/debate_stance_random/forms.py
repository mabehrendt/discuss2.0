from django import forms

from . import models


class StanceRandomSubjectForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        self.module = kwargs.pop('module')
        super().__init__(*args, **kwargs)
        self.fields['description'].widget = forms.Textarea({'rows': 4})

    class Meta:
        model = models.StanceRandomSubject
        fields = ['name', 'description']
