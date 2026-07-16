from django.shortcuts import render


def social_media_accounts_list(request):
    return render(request, "social_media_accounts.html")
