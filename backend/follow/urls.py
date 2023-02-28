from django.urls import path
from .views import *

urlpatterns = [
    path('following/<int:pk>/', FollowingList.as_view(), name='following-list'),
    path('followers/<int:pk>/', FollowersList.as_view(), name='follower-list'),
    path('follow/<int:pk>/', FollowDetail.as_view(), name='follow-detail'),
    path('requests_received/<int:pk>/', RequestListReceived.as_view(), name='request-list'),
    path('requests_sent/<int:pk>/', RequestListSent.as_view(), name='request-list'),
    path('request/<int:pk>/', RequestDetail.as_view(), name='request-detail'),
    path('friends/<int:pk>/', FriendList.as_view(), name='request-detail'),
    path("follow/", FollowPost.as_view(), name="follow-post"),
    
]