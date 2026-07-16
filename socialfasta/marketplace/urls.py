from django.urls import path
from .import marketplace_views

urlpatterns = [

    path('social_media/accounts/', marketplace_views.social_media_accounts_list, name="social_media_account")

]
