from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUser(UserAdmin):
    model = User
    fieldsets = (
        ("Account Information", {
            'fields': (
                'username', 'picture', 'balance', 'verified', 'password'
            ),
        }),
    ) + UserAdmin.fieldsets[1:]
    
    add_fieldsets = (
        ("Account Information", {
            'fields': (
                'username', 'picture', 'balance', 'verified', 'password'
            ),
        }),
    ) + UserAdmin.add_fieldsets[1:]

admin.site.register(User, CustomUser)