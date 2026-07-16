from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CustomUser

def user_login_page(request):
    return render(request, "login.html")

def user_registration_page(request):
    return render(request, "register.html")

def dashboard_base_page(request):
    return render(request, "dashboard_base.html")

def landing_page(requset):
    return render(requset, "landing_page.html")

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

def user_registration_api(request):

    if request.method == "POST":

        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        fullname = data.get("fullname")          # ilikuwa "username" - bug
        phonenumber = data.get("phonenumber")

        all_data_input = [
            email, password, username, fullname, phonenumber
        ]

        # "any()" ilikuwa inapitisha hata field moja ikijazwa - hatari.
        # "all()" inahakikisha ZOTE zimejazwa.
        if not all(value for value in all_data_input):
            return JsonResponse({
                "success": False,
                "message": "Tafadhali jaza taarifa zote."
            })

        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({
                "success": False,
                "message": "Email hii tayari imesajiliwa."
            })

        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({
                "success": False,
                "message": "Username hii tayari inatumika."
            })

        try:
            new_user = CustomUser.objects.create_user(
                email=email,
                password=password,
                username=username,
                fullname=fullname,
                phonenumber=phonenumber
            )
        except Exception:
            return JsonResponse({
                "success": False,
                "message": "Imeshindikana kuunda akaunti. Jaribu tena."
            })

        return JsonResponse({
            "success": True,
            "message": "account registered success"
        })

    return JsonResponse({
        "message": "POST only"
    })

def user_dashboard_page(request):
    return render(request, "dashboard.html")

def user_wallet_page(request):
    return render(request, "wallet.html")


        
        
        
