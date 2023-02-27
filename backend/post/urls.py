from django.urls import path 
from .views import PostView

urlpatterns = [
    path('posts/', PostView.newPost, name='newposts'),
    path('posts/<int:pk', PostView.editPost, name='editposts')
]