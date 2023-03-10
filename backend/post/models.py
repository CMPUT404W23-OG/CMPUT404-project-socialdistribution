import os

from django.db import models
from django.urls import reverse
from author.models import Author
from django.contrib.postgres.fields import ArrayField

HOST = os.getenv('HOST')

#posts are public by default (True)
#unlisted field for images

#for categories with ArrayField: https://docs.djangoproject.com/en/2.2/ref/contrib/postgres/fields/#arrayfield

class Post(models.Model):
    author_name = models.CharField(max_length=200)
    visibility = models.CharField(max_length=200, default='PUBLIC')
    author_id = models.ForeignKey('author.Author', default=None, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    public = models.BooleanField(default=True)
    description = models.CharField(max_length=200)
    contentType = models.CharField(max_length=200, default='text/plain', blank=True)
    image_url = models.URLField(max_length=200, blank=True)
    image_file = models.ImageField(upload_to='post_images', blank=True)
    body = models.TextField()
    datePublished = models.DateTimeField(auto_now_add=True) 
    dateEdited = models.DateTimeField(auto_now=True)
    unlisted = models.BooleanField(default=False)
    categories = ArrayField(models.CharField(max_length=200), blank=True, default=list)

#def get_absolute_path(self):
    #return reverse('posts-detail', kwargs={"pk": self.id})

def __str__(self):
    return self.title
