from django.shortcuts import render
from django.views import generic
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from django.core.paginator import Paginator
import base64
from django.core.files.base import ContentFile


from .models import Post, Comment, Likes

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
    def post(self, request, author_id, format=None):

        # set author id to the URL parameter
        updated = request.data.copy()
        updated['author_id'] = author_id

        if updated['contentType'][:5] == "image" and 'image_file' in updated:
            ext = updated['contentType'][6:]
            format, imageDecoded = updated['image_file'].split(';base64,') 
            data = ContentFile(base64.b64decode(imageDecoded), name="postImage." + ext)
            updated['image_file'] = data

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
        posts = Post.objects.all().filter(author_id=author_id).order_by('-datePublished')
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
        posts = Post.objects.all().filter(visibility="PUBLIC").order_by('-datePublished')
        
        if (request.query_params.get('page')):
            number = self.request.query_params.get('page', 1)
            size = self.request.query_params.get('size', 5)
            paginator = Paginator(posts, size)
            if ((paginator.num_pages + 1) > int(number)):
                serializer = PostSerializer(paginator.page(number), many=True)
            else:
                return Response([])
        else:

            serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)    
    
class PostCount(APIView):
    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def get(self, request):
        count = Post.objects.all().filter(visibility="PUBLIC").order_by('-datePublished').count()
        return Response(count)

class CommentView(APIView):
    def get_object(self, pk):
        try:
            Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            raise Http404
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def get(self, request, author_id, post_id, format=None):
        """
        Returns comments for a specific post.
        """
        if post_id and author_id:
            if Post.objects.filter(id=post_id, author_id=author_id).exists():
                if Comment.objects.filter(post_id=post_id, author_id=author_id).exists():
                    comments = Comment.objects.filter(post_id=post_id, author_id=author_id)
                    number = self.request.query_params.get('page', 1)
                    size = self.request.query_params.get('size', 5)
                    paginator = Paginator(comments, size)
                    serializer = CommentSerializer(paginator.page(number), many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'detail': 'No comments found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'POST ID and Author ID are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def post(self, request, author_id, post_id, format=None):
        if author_id and post_id:
            updated = request.data.copy()
            updated['author_id'] = author_id
            updated['post_id'] = post_id

            serializer = CommentSerializer(data=updated)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'POST ID and Author ID are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
class LikesView(APIView):
    def get_object(self, pk):
        try:
            Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            raise Http404
        
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def get(self, request, author_id, post_id, comment_id = None, format= None):
        if author_id and post_id and not comment_id:
            if Post.objects.filter(id=post_id, author_id=author_id).exists():
                if Likes.objects.filter(post_id=post_id, author_id=author_id).exists():
                    likes = Likes.objects.filter(post_id=post_id, author_id=author_id)
                    serializer = LikeSerializer(likes, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'detail': 'No likes found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
                
        elif author_id and post_id and comment_id:
            if Comment.objects.filter(post_id=post_id, post_id__author_id=author_id, id=comment_id).exists():
                if Likes.objects.filter(post_id=post_id, author_id=author_id, comment_id=comment_id).exists():
                    likes = Likes.objects.filter(post_id=post_id, author_id=author_id, comment_id=comment_id)
                    serializer = LikeSerializer(likes, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'detail': 'No likes found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'detail': 'POST ID and Author ID are required.'}, status=status.HTTP_400_BAD_REQUEST)

class LikesViewAdd(APIView):
    
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def post(self, request, author_id, format=None):
        if author_id:
            updated = request.data.copy()
            updated['author_id'] = author_id
            serializer = LikeSerializer(data=updated)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Author ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

