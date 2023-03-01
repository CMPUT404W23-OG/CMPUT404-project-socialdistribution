from django.urls import path 
from .views import PostView, PostList, AuthorPostList, CommentView, CommentbyAuthor, CommentbyPost

urlpatterns = [
    # path('', PostView.as_view(), name='posts'),
    # path('post', PostView.as_view(), name='newposts'),
    path('<int:pk>/', PostView.as_view(), name='get-single-post'),
    path('author/<int:author_id>', AuthorPostList.as_view(), name='get-authors-posts'),
    path('all/', PostList.as_view(), name='get-all-posts'),
    path('create/<int:author_id>', PostView.as_view(), name='create-post'),
    path('comment/', CommentView.as_view(), name='create-comment'),
    path('comment/<int:pk>', CommentView.as_view(), name='create-comment'),
    path('comment/author/<int:pk>', CommentbyAuthor.as_view(), name='get-comments-by-author'),
    path('comment/post/<int:pk>', CommentbyPost.as_view(), name='get-comments-by-post'),
]
