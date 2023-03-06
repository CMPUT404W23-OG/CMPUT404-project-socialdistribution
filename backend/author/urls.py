from django.urls import path 
from .views import SignUpView, AuthorList
from post.views import CommentView, LikesView, LikesViewAdd

urlpatterns = [
    path('<int:pk>/', SignUpView.as_view(), name='author'),
    path('delete/<int:pk>', SignUpView.as_view(), name='delete-author'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('all/', AuthorList.as_view(), name='all-authors'),
    path('<int:author_id>/posts/<int:post_id>/comments', CommentView.as_view(), name='comment'),
    path('<int:author_id>/posts/<int:post_id>/likes', LikesView.as_view(), name='post-like'),
    path('<int:author_id>/posts/<int:post_id>/comments/<int:comment_id>/likes', LikesView.as_view(), name='comment-like'),
    path('<int:author_id>/inbox', LikesViewAdd.as_view(), name='inbox'),
]