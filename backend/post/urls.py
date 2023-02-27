from django.urls import path 
from .views import PostView

urlpatterns = [
    path('posts', PostView.as_view(), name='posts'),
    path('posts/post', PostView.as_view(), name='newposts'),
    path('posts/<int:pk>', PostView.as_view(), name='editposts')
]
