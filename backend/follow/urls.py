from django.urls import path
from .views import *

urlpatterns = [
    path('following/<str:Email>/', FollowingList.as_view(), name='following-list'),
    path('followers/<str:Email>/', FollowersList.as_view(), name='follower-list'),
    path('follow/<int:pk>/', FollowDetail.as_view(), name='follow-detail'),
    path('requests_received/<str:Email>/', RequestListReceived.as_view(), name='request-list'),
    path('requests_sent/<str:Email>/', RequestListSent.as_view(), name='request-list'),
    path('request/<int:pk>/', RequestDetail.as_view(), name='request-detail'),
    path('friends/<str:Email>/', FriendList.as_view(), name='request-detail'),
    path("follow/", FollowPost.as_view(), name="follow-post"),
    
]