from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError


class AlreadyExistError(IntegrityError):
    pass

class FollowManager(models.Manager):

    def send_follow_request(self, follower, following):
        """send a follow request to another user"""

        if follower == following:
            raise ValidationError("You cannot follow yourself")
        
        if self.is_follow_request_sent(follower, following):
            raise AlreadyExistError("You have already sent a follow request to this user")
    

        if self.is_following(follower, following):
            raise AlreadyExistError("You are already following this user")
        
        request, created = Request.objects.get_or_create(follower=follower, following=following)
        if not created:
            request.delete()
            raise AlreadyExistError("You have already sent a follow request to this user")
        else:
            request.title = request.__str__()
            request.save()

        return request
    
    def unfollow(self, follower, following):
        """unfollow a user"""

        try:
            Follow.objects.get(follower=follower, following=following).delete()
            return True
        except self.model.DoesNotExist:
            return False
    
    def is_follow_request_sent(self, follower, following):
        """check if a follow request has been sent to another user"""
        return Request.objects.filter(follower=follower, following=following).exists()
    
    def is_following(self, follower, following):
        """check if a user is following another user"""
        try:
            Follow.objects.get(follower=follower, following=following)
            return True
        except self.model.DoesNotExist:
            return False

    def get_followers(self, user):
        """get all followers of a user"""
        return Follow.objects.filter(following=user)
    
    def get_following(self, user):
        """get all users a user is following"""
        return Follow.objects.filter(follower=user)
    
    def is_true_friend(self, follower, following):
        """check if two users are true friends"""
        return self.is_following(follower, following) and self.is_following(following, follower)
    
    def get_true_friends(self, user):
        """get all true friends of a user"""
        # return Follow.objects.filter(follower=user, following__in=self.get_followers(user))
        followers = self.get_followers(user)
        print(followers)

        followings = self.get_following(user)
        print(followings)
        friends = []
        for follower in followers:
            for following in followings:
                if follower.follower == following.following:
                    friends.append(follower)
        return friends
    
    def get_follow_requests(self, user):
        """get all follow requests sent to a user"""
        return Follow.objects.filter(following=user)
    
    def get_follow_requests_sent(self, user):
        """get all follow requests sent by a user"""
        return Follow.objects.filter(follower=user)
    
    

class Follow(models.Model):
    follower = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='follower')
    following = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='following')
    created = models.DateTimeField(auto_now_add=True)
    objects = FollowManager()

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower} is following {self.following} and the id is {self.id}"
    
    def save(self, *args, **kwargs):
        if self.follower == self.following:
            raise ValidationError("You cannot follow yourself")
        
        super().save(*args, **kwargs)





class Request(models.Model):
    follower = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='request_follower')
    following = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='request_following')
    created = models.DateTimeField(auto_now_add=True)
    objects = FollowManager()


    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower} has sent a follow request to {self.following} and the id is {self.id}"
    
    def save(self, *args, **kwargs):
        if self.follower == self.following:
            raise ValidationError("You cannot follow yourself")
        
        # check if already following
        if Follow.objects.filter(follower=self.follower, following=self.following).exists():
            raise AlreadyExistError("You are already following this user")
        
        super().save(*args, **kwargs)

    def accept(self):
        """accept a follow request"""
        follow = Follow.objects.create(follower=self.follower, following=self.following)
        self.delete()
        return follow
    
    def reject(self):
        """reject a follow request"""
        self.delete()
        return True
    
    def cancel(self):
        """cancel a follow request"""
        self.delete()
        return True


# TODO - add models for remote follow requests