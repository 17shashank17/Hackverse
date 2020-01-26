from django.urls import path
from .views import home, get_locations, get_stats

app_name = 'webapp'

urlpatterns = [
    path('',home),
    path('get_locations', get_locations, name="get_locations"),
    path('get_stats', get_stats, name='webapp'),
]
