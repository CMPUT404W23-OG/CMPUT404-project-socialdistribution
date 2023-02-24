from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.urls import reverse


class AuthorManager(BaseUserManager):

    use_in_migration = True
    
    def createAuthor(self, username, password=None, **extra_fields):
        author = self.model(username=username, **extra_fields)
        author.set_password(password)
        author.save(using=self._db)
        return author


# AbstractUser is a built-in Django model that has all the fields we need for a user
# We can add more fields to this model if we want to
class Author(AbstractUser):

    profile_image_url = models.URLField(max_length=200, blank=True)
    githubId = models.CharField(max_length=200, blank=True)
    api_user = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=200, blank=False)
    last_name = models.CharField(max_length=200, blank=False)
    
    objects = AuthorManager()
    USERNAME_FIELD = 'username'
    

    # if a user does not have a picture, use this default image
    def get_profile_image_url(self):
        if self.profile_image_url:
            return self.profile_image_url
        else:
            return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    

    # use id as the primary key and get url to the author profile
    def get_absolute_url(self): 
        return reverse("author-detail", kwargs={"pk": self.id})


    def __str__(self):
        return self.username
