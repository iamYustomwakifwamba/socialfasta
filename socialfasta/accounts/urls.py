from django.urls import path
from .import account_views

urlpatterns = [

    path('login/', account_views.user_login_page, name="login"),
    path('register/', account_views.user_registration_page, name="register"),
    path('login/api/', account_views.user_login_api, name="login_api"),
    path('register/api/', account_views.user_registration_api, name="registration_api")

]