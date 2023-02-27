from django.urls import path 
from .views import PostView, PostList

urlpatterns = [
    # path('', PostView.as_view(), name='posts'),
    # path('post', PostView.as_view(), name='newposts'),
    path('<int:pk>/', PostView.as_view(), name='get-single-post'),
    path('all/', PostList.as_view(), name='get-posts'),
    path('create/', PostView.as_view(), name='create-post'),

]
