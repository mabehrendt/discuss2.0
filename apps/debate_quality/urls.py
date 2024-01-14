from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        r'^(?P<year>\d{4})-(?P<pk>\d+)/$',
        views.AIQualitySubjectDetailView.as_view(),
        name='aiqualitysubject-detail'
    ),
    re_path(r'^(?P<slug>[-\w_]+)/$',
            views.AIQualitySubjectDetailView.as_view(),
            name='aiqualitysubject-redirect'
    ),
]
