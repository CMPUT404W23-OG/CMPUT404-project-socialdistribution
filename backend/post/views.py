from django.shortcuts import render
from django.views import generic
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from .serializers import PostSerializer


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
        # post = self.get_object(pk)
        # model = PostModel(post)

        # return Response(model.data)
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
    def post(self, request, format=None):
        serializer = PostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PostList(APIView):

    @extend_schema(request=PostSerializer, responses=PostSerializer)
    def get(self, request):
        serializer = PostSerializer(Post.objects.all(), many=True)
        return Response(serializer.data)

    #https://stackoverflow.com/questions/59516835/how-to-edit-an-object-using-model-form-in-django
    # def newPost(request):
    #     if request.method == 'GET':
    #         form = PostModel()
    #     else:
    #         form = PostModel(request.POST)

    #         if form.is_valid():
    #             form.save()

    #             #TODO connect to path
    #             #return redirect()
        
    #     #TODO connect to path   
    #     #return render(request,)

    # def editPost(request, pk):
    #     object = Post.objects.get(id=pk)

    #     if request.method == 'GET':
    #         form = PostModel(instance=object)
    #     else:
    #         form = PostModel(request.POST, instance=object)

    #         if form.is_valid():
    #             form.save()

    #             #TODO connect to path
    #             #return redirect()
        
    #     #TODO connect to path   
    #     #return render(request,)