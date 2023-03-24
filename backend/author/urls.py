from django.urls import path 
from .views import SignUpView, AuthorList
from post.views import AuthorLikesView

urlpatterns = [
    path('<int:pk>/', SignUpView.as_view(), name='author'),
    path('delete/<int:pk>', SignUpView.as_view(), name='delete-author'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('all/', AuthorList.as_view(), name='all-authors'),
    path('<int:author_id>/likes', AuthorLikesView.as_view(), name='author-likes'),
]