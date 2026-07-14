from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "email", "username", "fullname",
         "phonenumber", "role",
        "is_staff", "is_active"
    )

    search_fields = (
        "email", "username", "fullname",
        "phonenumber"
    )

    list_filter = (
        "role", "is_staff",
        "is_active", "is_superuser"
    )

    ordering = ("email",)

    fieldsets = (
        ("User Information", {
            "fields": (
                ("email", "username"),
                ("fullname"),
                ("phonenumber", "role"),
                ("password",),
            )
        }),

        ("Permissions", {
            "fields": (
                ("is_active", "is_staff", "is_superuser"),
                ("groups", "user_permissions"),
            )
        }),

        ("Login Information", {
            "fields": (
                ("last_login",),
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                ("email", "username"),
                ("fullname"),
                ("phonenumber", "role"),
                ("password1", "password2"),
                ("is_active", "is_staff", "is_superuser"),
            ),
        }),
    )