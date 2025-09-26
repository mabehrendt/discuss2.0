from django.urls import path
from .views import display_same_users, display_diff_users, display_all_users

urlpatterns = [
    path('display_same_users/', display_same_users, name='display_same_users'),
    path('display_diff_users/', display_diff_users, name='display_diff_users'),
    path('display_all_users/', display_all_users, name='display_all_users'),

]

