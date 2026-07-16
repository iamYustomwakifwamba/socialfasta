from django.urls import path
from .import smm_views

urlpatterns = [

    path('orders/', smm_views.smm_orders_page, name="smm_orders")

]