from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.urls import reverse
from django.core.files import File
import os
import urllib
from dotenv import load_dotenv

BASEDIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASEDIR, '.env'))
HOST = os.getenv('HOST')


# https://medium.com/@poorva59/implementing-simple-jwt-authentication-in-django-rest-framework-3e54212f14da
# functions for creating authors and admins
class AuthorManager(BaseUserManager):

    use_in_migration = True
    
    def createAuthor(self, username, password=None, **extra_fields):
        """
        Creates the author.
        """
        author = self.model(username=username, **extra_fields)
        author.set_password(password)
        author.save(using=self._db)
        return author
    
    def create_superuser(self, username, password, **extra_fields):
        """
        Creates an author with superuser privileges.

        """
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        
        return self.createAuthor(username, password, **extra_fields)



# AbstractUser is a built-in Django model that has all the fields we need for a user
# We can add more fields to this model if we want to
class Author(AbstractUser):
    
    profile_image_url = models.URLField(max_length=200, blank=True)
    # profile_image_file = models.ImageField(upload_to='profile_images', blank=True)
    host = models.URLField(max_length=200, blank=False, default=HOST)
    url = models.URLField(max_length=200, blank=False, default=HOST)
    
    githubId = models.CharField(max_length=200, blank=True)
    api_user = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    remote_id = models.CharField(max_length=250, blank=True)
    remote_name = models.CharField(max_length=250, blank=True)
    
    objects = AuthorManager()
    USERNAME_FIELD = 'username'
    
    # if a user does not have a picture, use this default image
    def get_profile_image_url(self):
        if self.profile_image_url:
            return self.profile_image_url
        else:
            return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    
    # set author url to base url and path to author
    def set_absolute_url(self): 
        self.url = self.url + 'author/' + str(self.id)
        return None
        # return reverse("author-detail", kwargs={"pk": self.id})

    def __str__(self):
        return self.username
