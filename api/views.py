from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import F
import math
from .models import Location, DistressLocation

def haversine(lat1, lon1, lat2, lon2): 
    dLat = (lat2 - lat1) * math.pi / 180.0
    dLon = (lon2 - lon1) * math.pi / 180.0
  
    # convert to radians 
    lat1 = (lat1) * math.pi / 180.0
    lat2 = (lat2) * math.pi / 180.0
  
    # apply formulae 
    a = (pow(math.sin(dLat / 2), 2) + pow(math.sin(dLon / 2), 2) * math.cos(lat1) * math.cos(lat2))
    rad = 6371000
    c = 2 * math.asin(math.sqrt(a)) 
    return rad * c 

def mark_safe_location(request):
    latitude = float(request.GET.get('latitude'))
    longitude = float(request.GET.get('longitude'))

    objects = Location.objects.all()

    flag = False

    for obj in objects:
        print(haversine(obj.latitude, obj.longitude, latitude, longitude))
        if haversine(obj.latitude, obj.longitude, latitude, longitude) < 50:
            obj.safe_count = F('safe_count') + 1
            obj.save()
            flag = True
    
    if not flag:
        Location(latitude = latitude, longitude = longitude).save()
    return HttpResponse()

def get_nearest_safe_location(request):
    objects = Location.objects.all()
    min_dist = 999999999
    loc = None

    latitude = float(request.GET.get('latitude'))
    longitude = float(request.GET.get('longitude'))
    
    for obj in objects:
        h = haversine(latitude, longitude, obj.latitude, obj.longitude)
        if h < min_dist:
            min_dist = h
            loc = obj
    if loc is None:
        return JsonResponse({})
    return JsonResponse({
        'latitude'  : loc.latitude,
        'longitude' : loc.longitude
    })

def mark_unsafe_location(request):
    latitude = float(request.GET.get('latitude'))
    longitude = float(request.GET.get('longitude'))

    objects = Location.objects.all()

    flag = False
    for obj in objects:
        if haversine(obj.latitude, obj.longitude, latitude, longitude) < 50:
            if obj.safe_count == 1:
                obj.delete()
            else:
                obj.safe_count = F('safe_count') - 1
                obj.save()

    return HttpResponse()

def get_all_safe_locations(request):
    res = []

    for obj in Location.objects.all():
        res.append({
            'latitude'  : obj.latitude,
            'longitude' : obj.longitude 
        })
    return JsonResponse(res, safe=False)

def get_stats(request):
    return JsonResponse({
        'number_of_people_in_distress'  : len(DistressLocation.objects.all()),
    })

def sos_distress(request):
    latitude = float(request.GET.get('latitude'))
    longitude = float(request.GET.get('longitude'))

    DistressLocation(latitude=latitude, longitude=longitude).save()
    return HttpResponse()