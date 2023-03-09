from django.urls import path 

from .views import PostView, PostList, AuthorPostList, PostCount, CommentView, LikeView

urlpatterns = [
    path('<int:pk>/', PostView.as_view(), name='get-single-post'),
    path('author/<int:author_id>', AuthorPostList.as_view(), name='get-authors-posts'),
    path('all/', PostList.as_view(), name='get-all-posts'),
    path('create/<int:author_id>', PostView.as_view(), name='create-post'),
    path('all/count', PostCount.as_view(), name='count-posts'),
    path('<int:post_id>/comments', CommentView.as_view(), name='all-comment'),
    path('<int:post_id>/likes', LikeView.as_view(), name='post-like'),
    path('comments/<int:comment_id>/likes', LikeView.as_view(), name='comment-like'),
]
