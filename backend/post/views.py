from django.shortcuts import render
from django.views import generic

from .models import Post

# Create your views here.
# TODO NEED TO CONNECT TO FRONT END

class PostView(generic.ListView):
    def get_queryset(self):
        return Post.objects.order_by('-datePublished')

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