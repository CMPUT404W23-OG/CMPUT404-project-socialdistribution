from django.db import models
from django.forms import ModelForm
from django.urls import reverse
from author.models import Author

#posts are public by default (True)
#unlisted field for images
#contenttype -> image posts (how do we wanna do it) TODO

class Post(models.Model):
    author = models.ForeignKey('author.Author', default=None, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    public = models.BooleanField(default=True)
    description = models.CharField(max_length=200)
    body = models.TextField()
    datePublished = models.DateTimeField(auto_now_add=True)
    dateEdited = models.DateTimeField(auto_now=True)
    unlisted = models.BooleanField(default=False)
    #author field TODO
    #ID field TODO

#def get_absolute_path(self):
    #return reverse('posts-detail', kwargs={"pk": self.id})

def __str__(self):
    return self.title
