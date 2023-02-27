from django.shortcuts import render
from django.views import generic
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utls import extend_schema

from .models import Post
from .forms import PostModel

# Create your views here.
# TODO NEED TO CONNECT TO FRONT END

class PostView(generic.ListView):
    def get_object(self, pk):
        try:
            Post.objects.get(id=pk)
        except Post.DoesNotExist:
            raise Http404
    
    @extend_schema(request=PostModel, responses=PostModel)
    def get(self, request, pk, format=None):
        post = self.get_object(pk)
        model = PostModel(post)

        return Response(model.data)
    
    @extend_schema(request=PostModel, responses=PostModel)
    def delete(self, request, pk, format=None):
        post = self.get_object(pk)
        post.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    #https://stackoverflow.com/questions/59516835/how-to-edit-an-object-using-model-form-in-django
    def newPost(request):
        if request.method == 'GET':
            form = PostModel()
        else:
            form = PostModel(request.POST)

            if form.is_valid():
                form.save()

                #TODO connect to path
                #return redirect()
        
        #TODO connect to path   
        #return render(request,)

    def editPost(request, pk):
        object = Post.objects.get(id=pk)

        if request.method == 'GET':
            form = PostModel(instance=object)
        else:
            form = PostModel(request.POST, instance=object)

            if form.is_valid():
                form.save()

                #TODO connect to path
                #return redirect()
        
        #TODO connect to path   
        #return render(request,)