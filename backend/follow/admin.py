from django.contrib import admin

# Register your models here.
from .models import Follow, Request

admin.site.register(Follow)
admin.site.register(Request)