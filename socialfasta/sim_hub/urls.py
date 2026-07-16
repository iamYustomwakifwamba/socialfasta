from django.urls import path
from .import sim_views

urlpatterns = [

    path('orders/', sim_views.sms_phonenumber_orders, name='phonenumber_orders')

]

