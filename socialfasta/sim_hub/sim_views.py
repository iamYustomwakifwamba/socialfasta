from django.shortcuts import render



def sms_phonenumber_orders(request):
    return render(request, "SIM_orders.html")
