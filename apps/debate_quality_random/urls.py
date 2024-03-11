from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        r'^(?P<year>\d{4})-(?P<pk>\d+)/$',
        views.QualityRandomSubjectDetailView.as_view(),
        name='qualityrandomsubject-detail'
    ),
    re_path(r'^(?P<slug>[-\w_]+)/$',
            views.QualityRandomSubjectDetailView.as_view(),
            name='qualityrandomsubject-redirect'
    ),
]
