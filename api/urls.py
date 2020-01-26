from django.urls import path
from .views import mark_safe_location, get_all_safe_locations, get_nearest_safe_location, get_stats, mark_unsafe_location, sos_distress, get_all_distress_locations

urlpatterns = [
    path('mark_safe_location', mark_safe_location),
    path('get_nearest_safe_location', get_nearest_safe_location),
    path('mark_unsafe_location', mark_unsafe_location),
    path('get_all_safe_locations', get_all_safe_locations),
    path('get_stats', get_stats),
    path('sos_distress', sos_distress),
    path('get_all_distress_locations', get_all_distress_locations)
]
