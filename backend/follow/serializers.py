from rest_framework import serializers
from .models import Follow, Request
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ["id","follower", "following", "created"]


class RequestSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Request
        fields = ["id","follower", "following", "created"]
    

class FriendSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ["id","follower", "following", "created"]
        

class FollowPostSerializer(serializers.ModelSerializer):

    # input is primary key
    follower = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    following = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    # follower = serializers.pr
    # following = serializers.EmailField()
  
    class Meta:
        model = Follow
        fields = ["id","follower", "following", "created"]


        
class RequestPostSerializer(serializers.ModelSerializer):

    Approve = serializers.BooleanField()
    Cancel = serializers.BooleanField()
    class Meta:
        model = Request
        fields = [ "Approve", "Cancel"]
