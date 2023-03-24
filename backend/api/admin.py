from django.contrib import admin

# Register your models here.
from .models import Incoming_Node, Outgoing_Node

admin.site.register(Incoming_Node)
admin.site.register(Outgoing_Node)