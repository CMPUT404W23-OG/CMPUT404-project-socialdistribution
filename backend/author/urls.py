from django.urls import path 
from .views import SignUpView

urlpatterns = [
    path('<int:pk>/', SignUpView.as_view(), name='author'),
    path('delete/<int:pk>', SignUpView.as_view(), name='delete-author'),
    path('signup/', SignUpView.as_view(), name='signup'),
]