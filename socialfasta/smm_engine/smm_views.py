from django.shortcuts import render



def smm_orders_page(request):
    return render(request, "orders.html")
