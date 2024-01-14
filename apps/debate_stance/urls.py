from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        r'^(?P<year>\d{4})-(?P<pk>\d+)/$',
        views.AIStanceSubjectDetailView.as_view(),
        name='aistancesubject-detail'
    ),
    re_path(r'^(?P<slug>[-\w_]+)/$',
            views.AIStanceSubjectDetailView.as_view(),
            name='aistancesubject-redirect'
    ),
]
