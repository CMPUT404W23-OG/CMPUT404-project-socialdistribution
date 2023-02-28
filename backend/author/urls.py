from django.urls import path 
from .views import SignUpView, AuthorList

urlpatterns = [
    path('<int:pk>/', SignUpView.as_view(), name='author'),
    path('delete/<int:pk>', SignUpView.as_view(), name='delete-author'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('all/', AuthorList.as_view(), name='all-authors'),

]