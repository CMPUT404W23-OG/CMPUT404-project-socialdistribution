"""socialdistribution URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from . import views
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static
from api.views import remoteUserListView, remoteUserDetailView, remoteFollowersListView, remoteFollowersDetailView, \
    remotePostsListView, remotePostDetailView, remoteCommentsListView, remoteLikesListView, remoteCommentLikesListView, \
    remoteAuthorLikesListView, remoteInboxView



urlpatterns = [
    path("admin/", admin.site.urls),
    path("author/", include("author.urls")),
    path("posts/", include("post.urls")),
    path("api/", include("api.urls")),
    path("", include("follow.urls")),
    path('service/authors/<str:AUTHOR_ID>/',remoteUserDetailView.as_view() , name='author-details'),
    path('service/authors/',remoteUserListView.as_view() , name='authors'),
    path('service/authors/<str:AUTHOR_ID>/followers/', remoteFollowersListView.as_view() , name='followers-list'),
    path('service/authors/<str:AUTHOR_ID>/followers/<str:FOLLOWER_ID>', remoteFollowersDetailView.as_view() , name='followers-detail'),
    path('service/authors/<str:AUTHOR_ID>/posts/', remotePostsListView.as_view() , name='posts-list'),
    path('service/authors/<str:AUTHOR_ID>/posts/<str:POST_ID>', remotePostDetailView.as_view() , name='posts-detail'),
    path('service/authors/<str:AUTHOR_ID>/posts/<str:POST_ID>/comments/', remoteCommentsListView.as_view() , name='comments-list'),
    path('service/authors/<str:AUTHOR_ID>/posts/<str:POST_ID>/likes/', remoteLikesListView.as_view() , name='likes-list'),
    path('service/authors/<str:AUTHOR_ID>/posts/<str:POST_ID>/comments/<str:COMMENT_ID>/likes/', remoteCommentLikesListView.as_view() , name='comments-likes-list'),
    path('service/authors/<str:AUTHOR_ID>/liked/', remoteAuthorLikesListView.as_view() , name='author-likes-list'),
    path('service/authors/<str:AUTHOR_ID>/inbox', remoteInboxView.as_view() , name='inbox'),
    # re_path(r'^$', schema_view)
    path("api/schema", SpectacularAPIView.as_view(), name="schema"),
    
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
