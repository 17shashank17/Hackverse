from django.shortcuts import render, HttpResponse
import json
import requests

def home(request):
    return render(request, 'webapp/home.html')

def get_locations(request):
    # res = requests.get('http://'+HOSTED_AT+'get_all_safe_locations')
    # safe_locations = json.dumps(res)
    # return resJson
    # print(safe_locations)
    return render(request, 'webapp/locations.html')

def get_stats(request):
    return JsonResponse({
        'number_of_people_in_distress'  : len(DistressLocation.objects.all()),
    })