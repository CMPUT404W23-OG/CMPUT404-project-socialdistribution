from django.shortcuts import render
from django.views import generic
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from .serializers import PostSerializer, CommentSerializer, LikeSerializer, CommentPostSerializer, LikePostSerializer
from django.core.paginator import Paginator
import base64
from django.core.files.base import ContentFile


from .models import Post, Comment, Like, Author

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
        
        #https://stackoverflow.com/questions/39576174/save-base64-image-in-django-file-field
        if updated['contentType'][:5] == "image" and 'image_file' in updated and updated['image_file'] != None:
            ext = updated['contentType'][6:]
            
            format, imageDecoded = (updated['image_file']).split(';base64,') 
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
            return Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            raise Http404
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def get(self, request, post_id, format=None):
        """
        Provide the post ID as a URL parameter.\n
        Returns all comments for a specific post.\n 
        Example: http://localhost:8000/posts/1/comments Returns all comments for post 1
        """
        if post_id:
            if Post.objects.filter(id=post_id).exists():
                if Comment.objects.filter(post=post_id).exists():
                    comments = Comment.objects.filter(post=post_id)
                    number = self.request.query_params.get('page', 1)
                    size = self.request.query_params.get('size', 5)
                    paginator = Paginator(comments, size)
                    serializer = CommentSerializer(paginator.page(number), many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'detail': 'No comments found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'POST ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def post(self, request, post_id, format=None):
        """
        Provide the post ID as URL parameters and author ID in Request body.\n
        Creates a new comment for a specific post.\n
        Example: http://localhost:8000/posts/27/comments Creates a new comment for post 27\n
        Request body: {"comment": "This is a comment", 
                        "author": 2}
        """
        if  post_id:
            request.data['post'] = post_id
            serializer = CommentPostSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'POST ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def patch(self, request, post_id, comment_id, format=None):
        """
        Provide the post ID and comment ID as URL parameters and author ID in Request body.\n
        Updates a specific comment for a specific post.\n
        Example: http://localhost:8000/posts/27/comments/2 Updates comment with id 2 for post 27\n
        Request body: {"comment": "This is a comment"}
        """
        author_id = request.data.get('author')
        if author_id:
            return Response({'detail': 'Author ID cannot be changed.'}, status=status.HTTP_400_BAD_REQUEST)
        if  post_id and comment_id:
            if Comment.objects.filter(pk=comment_id,post=post_id).exists():
                comment = self.get_object(comment_id)
                serializer = CommentSerializer(comment, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'detail': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)    
        return Response({'detail': 'POST ID and COMMENT ID are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(request=CommentSerializer, responses=CommentSerializer)
    def delete(self, request, post_id, comment_id, format=None):
        """
        Provide the post ID and comment ID as URL parameters.\n
        Deletes a specific comment for a specific post.\n
        Example: http://localhost:8000/posts/27/comments/2 Deletes comment with id 2 for post 27
        """
        if  post_id and comment_id:
            if Comment.objects.filter(pk=comment_id,post=post_id).exists():
                comment = self.get_object(comment_id)
                comment.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'detail': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'POST ID and COMMENT ID are required.'}, status=status.HTTP_400_BAD_REQUEST)

class LikeView(APIView):
    def get_object(self, pk):
        try:
            Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            raise Http404
        
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def get(self, request, post_id = None, comment_id = None, format= None):
        """
        Provide only post ID as a URL parameter.\n
        Returns all likes for a specific post.\n
        Example: http://localhost:8000/posts/27/likes Returns all likes for post with id 27\n
        
        Provide only comment ID as a URL parameter.\n
        Returns all likes for a specific comment.\n
        Example: http://localhost:8000/posts/comments/2/likes Returns all likes for comment with id 2
        """
        if post_id and not comment_id:
            if Post.objects.filter(id=post_id).exists():
                if Like.objects.filter(post=post_id, comment__isnull=True).exists():
                    likes = Like.objects.filter(post=post_id, comment__isnull=True)
                    serializer = LikeSerializer(likes, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'detail': 'No likes found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
                
        elif comment_id and not post_id:
            if Comment.objects.filter(id=comment_id).exists():
                if Like.objects.filter(comment=comment_id).exists():
                    likes = Like.objects.filter(comment=comment_id)
                    serializer = LikeSerializer(likes, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'detail': 'No likes found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'detail': 'Either POST ID or Comment ID required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def post(self, request, post_id = None, comment_id = None, format= None):
        """
        Provide only post ID as a URL parameter and author ID of the user who wants to like the comment in the request body.\n
        Creates a new like for a specific post.\n
        Example: http://localhost:8000/posts/27/likes Creates a new like for post with id\n
        Request body: {"summary" : "Author 1 likes your post.",
                       "author" : "1"}
        
        Provide only comment ID as a URL parameter and author ID of the user who wants to like the comment in the request body.\n
        Creates a new like for a specific comment.\n
        Example: http://localhost:8000/posts/comments/2/likes Creates a new like for comment with id 2\n
        Request body: {"summary" : "Author 1 likes your comment.",
                        "author" : "1"}
        """
        if post_id and not comment_id:
            request.data['post'] = post_id
            like_author = request.data.get('author')
            if like_author:
                if Like.objects.filter(author=like_author, post=post_id, comment__isnull=True).exists():
                    return Response({'detail': 'You have already liked this post.'}, status=status.HTTP_400_BAD_REQUEST)
        elif comment_id and not post_id:
            request.data['comment'] = comment_id
            like_author = request.data.get('author')
            if like_author:
                if Like.objects.filter(author=like_author, comment=comment_id, post__isnull=True).exists():
                    return Response({'detail': 'You have already liked this comment.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Either POST ID or Comment ID required.'}, status=status.HTTP_400_BAD_REQUEST)
                
        serializer = LikePostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def delete(self, request, like_id, format= None):
        """
        Provide the like ID as a URL parameter.\n
        Deletes a specific like.\n
        Example: http://localhost:8000/posts/likes/2 Deletes like with id 2
        """
        if Like.objects.filter(id=like_id).exists():
            like = Like.objects.get(id=like_id)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'detail': 'Like not found.'}, status=status.HTTP_404_NOT_FOUND)
    
class AuthorLikesView(APIView):
    def get_object(self, pk):
        try:
            Author.objects.get(id=pk)
        except Author.DoesNotExist:
            raise Http404
        
    @extend_schema(request=LikeSerializer, responses=LikeSerializer)
    def get(self, request, author_id, format= None):
        """
        Provide the author ID as a URL parameter.\n
        Returns all likes for a specific author.\n
        Example: http://localhost:8000/authors/1/likes Returns all likes for author with id 1
        """
        if Author.objects.filter(id=author_id).exists():
            if Like.objects.filter(author=author_id).exists():
                likes = Like.objects.filter(author=author_id)
                serializer = LikeSerializer(likes, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'detail': 'No likes found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Author not found.'}, status=status.HTTP_404_NOT_FOUND)