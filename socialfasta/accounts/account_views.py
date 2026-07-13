from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def user_login_page(request):
    return render(request, "login.html")

def user_registration_page(request):
    return render(request, "register.html")

def user_login_api(request):

    if request.method == "POST":

        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        user = authenticate(
            request,
            email=email,
            password=password
        )

        if user:
            login(request, user)

            return JsonResponse({
                "success":True,
                "message":"Login successful"
            })
        
        return JsonResponse({
            "success": False,
            "message":"Invalid credentials data"
        })
    
    return JsonResponse({
        "message": "POST only"
    })