from django.contrib import admin
from .models import Author

# Register your models here.
class AuthorModelAdmin(admin.ModelAdmin):
    list_filter= ["api_user"]

admin.site.register(Author, AuthorModelAdmin)