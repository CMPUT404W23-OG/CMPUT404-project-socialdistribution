from django.shortcuts import render
from django.views import generic
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from .serializers import PostSerializer
from django.core.paginator import Paginator
import base64
from django.core.files.base import ContentFile


from .models import Post

# Create your views here.
# TODO NEED TO CONNECT TO FRONT END

class PostView(APIView):
    def get_object(self, pk):
        try:
            Post.objects.get(id=pk)
        except Post.DoesNotExist:
            raise Http404
    
    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def get(self, request, pk, format=None):
        """
        Returns information for the author.
        """
        postId = pk
        if postId:
            try:
                post = Post.objects.get(pk=postId)
            except Post.DoesNotExist:
                return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
            post_data = Post.objects.get(pk=postId)

            serializer = PostSerializer(post_data)
            return Response(serializer.data)
        else:
            return Response({'detail': 'ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    
    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def delete(self, request, pk, format=None):
        post = Post.objects.get(pk=pk)
        post.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def post(self, request, author_id, image, contentType, format=None):

        # set author id to the URL parameter
        updated = request.data.copy()
        updated['author_id'] = author_id

        if contentType[:5] == "image":
            ext = contentType[6:]
            format, imageDecoded = image.split(';base64,') 
            data = ContentFile(base64.b64decode(imageDecoded), name="postImage." + ext)
            updated['image'] = data

        serializer = PostSerializer(data=updated)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AuthorPostList(APIView):

    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def get(self, request, author_id):
        """
        Returns all posts for a specific author, can be used with pagination.
        
        Example: This will return the second page of posts belonging to author 39 if there are 3 posts per page
        http://localhost:8000/posts/author/39?page=2&size=3 
        
        """
        posts = Post.objects.all().filter(author_id=author_id).order_by('datePublished')
        number = self.request.query_params.get('page', 1)
        size = self.request.query_params.get('size', 5)

        paginator = Paginator(posts, size)

        serializer = PostSerializer(paginator.page(number), many=True)
        return Response(serializer.data)
    
class PostList(APIView):

    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def get(self, request):
        """
        Returns all posts, can be used with pagination.
        
        Example: This will return the second page of posts if there are 3 posts per page
        http://localhost:8000/posts/all?page=2&size=3 
        
        """
        posts = Post.objects.all().filter(visibility="PUBLIC").order_by('datePublished')
        number = self.request.query_params.get('page', 1)
        size = self.request.query_params.get('size', 5)

        paginator = Paginator(posts, size)
        serializer = PostSerializer(paginator.page(number), many=True)
        return Response(serializer.data)    

    