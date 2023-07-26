from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        r'^(?P<year>\d{4})-(?P<pk>\d+)/$',
        views.AISubjectDetailView.as_view(),
        name='aisubject-detail'
    ),
    re_path(r'^(?P<slug>[-\w_]+)/$',
            views.AISubjectDetailView.as_view(),
            name='aisubject-redirect'
    ),
]
