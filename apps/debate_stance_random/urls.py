from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        r'^(?P<year>\d{4})-(?P<pk>\d+)/$',
        views.StanceRandomSubjectDetailView.as_view(),
        name='stancerandomsubject-detail'
    ),
    re_path(r'^(?P<slug>[-\w_]+)/$',
            views.StanceRandomSubjectDetailView.as_view(),
            name='stancerandomsubject-redirect'
    ),
]
