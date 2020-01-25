from django.shortcuts import render
from django.http import JsonResponse

def mark_safe_location(request):
    return JsonResponse({'aakash': '123'})

def get_nearest_safe_location(request):
    return JsonResponse({'aakash': '123'})

def mark_unsafe_location(request):
    return JsonResponse({'aakash': '123'})

def get_all_safe_locations(request):
    return JsonResponse({'aakash': '123'})

def get_stats(request):
    return JsonResponse({'aakash': '123'})