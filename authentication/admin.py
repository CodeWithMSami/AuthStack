from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUser(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + (
        ("Account Information", {
            'fields': (
                'balance', 'picture'
            ),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Account Information", {
            'fields': (
                'balance', 'picture'
            ),
        }),
    )

admin.site.register(User, CustomUser)