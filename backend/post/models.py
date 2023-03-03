from django.db import models
from django.forms import ModelForm
from django.urls import reverse
from author.models import Author

#posts are public by default (True)
#unlisted field for images
#contenttype -> image posts (how do we wanna do it) TODO

class Post(models.Model):
    type = models.CharField(max_length=200, default='post')
    title = models.CharField(max_length=200)
    author_name = models.CharField(max_length=200)
    visibility = models.CharField(max_length=200, default='PUBLIC')
    author_id = models.ForeignKey('author.Author', default=None, on_delete=models.CASCADE)
    public = models.BooleanField(default=True)
    description = models.CharField(max_length=200)
    body = models.TextField()
    datePublished = models.DateTimeField(auto_now_add=True)
    dateEdited = models.DateTimeField(auto_now=True)
    unlisted = models.BooleanField(default=False)
    #author field TODO
    #ID field TODO
    def __str__(self):
        return self.title

class Comment(models.Model):
    type = models.CharField(max_length=200, default='comment')
    author = models.ForeignKey('author.Author', on_delete=models.CASCADE)
    comment = models.TextField()
    contentType = models.CharField(max_length=200, default='text/markdown')
    published = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey('post.Post', on_delete=models.CASCADE)
    
class Likes(models.Model):
    context = models.CharField(max_length=200, default='https://www.w3.org/ns/activitystreams')
    summary = models.CharField(max_length=200)
    type = models.CharField(max_length=200, default='Like')
    author = models.ForeignKey('author.Author', on_delete=models.CASCADE)
    post = models.ForeignKey('post.Post', on_delete=models.CASCADE)
    comment = models.ForeignKey('post.Comment', blank=True, on_delete=models.CASCADE)
