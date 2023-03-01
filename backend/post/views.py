from django.shortcuts import render
from django.views import generic
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from .serializers import PostSerializer, CommentSerializer
from django.core.paginator import Paginator


from .models import Post, Comment

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

        # save post to database, assigned to author_id
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

class CommentView(APIView):
    def get_object(self, pk):
        try:
            Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            raise Http404
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def get(self, request, pk = None, format=None):
        """
        Returns information for the author.
        """
        if not pk:
            return Response({'detail': 'ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        commentId = pk
        if commentId:
            try:
                comment = Comment.objects.get(pk=commentId)
            except Comment.DoesNotExist:
                return Response({'detail': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)
            comment_data = Comment.objects.get(pk=commentId)

            serializer = CommentSerializer(comment_data)
            return Response(serializer.data)
        else:
            return Response({'detail': 'ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def delete(self, request, pk = None, format=None):
        if not pk:
            return Response({'detail': 'ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.get(pk=pk)
        comment.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def post(self, request, pk=None, format=None):
        if not pk:
            # set author id to the URL parameter
            new_data = request.data.copy()

            # save post to database, assigned to author_id
            serializer = CommentSerializer(data=new_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'ID parameter is not required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def patch(self, request, pk=None, format=None):
        if not pk:
            return Response({'detail': 'ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.get(pk=pk)
        updated = request.data.copy()
        updated['id'] = pk
        serializer = CommentSerializer(comment, data=updated, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CommentbyPost(APIView):
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def get(self, request, post_id):
        """
        Returns all comments for a specific post, can be used with pagination.
        
        Example: This will return the second page of comments belonging to post 39 if there are 3 comments per page
        http://localhost:8000/comments/post/39?page=2&size=3 
        
        """
        comments = Comment.objects.all().filter(post_id=post_id).order_by('created_on')
        number = self.request.query_params.get('page', 1)
        size = self.request.query_params.get('size', 5)

        paginator = Paginator(comments, size)

        serializer = CommentSerializer(paginator.page(number), many=True)
        return Response(serializer.data)
    
class CommentbyAuthor(APIView):
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def get(self, request, author_id):
        """
        Returns all comments for a specific author, can be used with pagination.
        
        Example: This will return the second page of comments belonging to author 39 if there are 3 comments per page
        http://localhost:8000/comments/author/39?page=2&size=3 
        
        """
        comments = Comment.objects.all().filter(author_id=author_id).order_by('created_on')
        number = self.request.query_params.get('page', 1)
        size = self.request.query_params.get('size', 5)

        paginator = Paginator(comments, size)

        serializer = CommentSerializer(paginator.page(number), many=True)
        return Response(serializer.data)