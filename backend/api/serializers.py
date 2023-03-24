from rest_framework import serializers
from author.models import Author
from post.models import Post, Comment, Like
from django.contrib.auth import get_user_model

class remoteAuthorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "host", "url", "displayName", "github", "profileImage"]
        extra_kwargs = {
            'displayName': {'source': 'username'},
            'profileImage': {'source': 'profile_image_url'},
            'github': {'source': 'githubId', 'default': ''},
           
        }   

        def get_id(self, obj):
            if obj.remote_id:
                return obj.remote_id
            else:
                return obj.id

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['github'] =  f"https://github.com/{data['github']}"
        return data
    

class remoteAuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = ["id", "host", "url", "displayName", "github", "profileImage"]
        extra_kwargs = {
            'displayName': {'source': 'username'},
            'profileImage': {'source': 'profile_image_url'},
            'github': {'source': 'githubId', 'default': ''},
            'type': {'default': 'author'},
           
        }   
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['github'] =  f"https://github.com/{data['github']}"
        type_data = {'type': 'author'}
        return {**type_data, **data}
 

class remotePostsSerializer(serializers.ModelSerializer):
    source = serializers.CharField(default="http://31552.yeg.rac.sh")
    origin = serializers.CharField(default="http://31552.yeg.rac.sh")
    author = remoteAuthorSerializer(source="author_id")


    class Meta:
        model = Post
        fields = ["title", "id", "source", "origin", "description", "contentType", "content", "author"   , "categories", "published", "visibility", "unlisted"]
        extra_kwargs = {
           
            "published": {"source": "datePublished"},
            "content" :{"source": "body"},

       
        }

    def create(self, validated_data):
        validated_data["source"] = "http://31552.yeg.rac.sh"
        validated_data["origin"] = "http://31552.yeg.rac.sh"

        instance = super().create(validated_data)
        return instance

   
class remoteCommentsSerializer(serializers.ModelSerializer):
    source = serializers.CharField(default="http://31552.yeg.rac.sh")
    origin = serializers.CharField(default="http://31552.yeg.rac.sh")

    class Meta:
        model = Comment
        fields = ["id", "author", "comment", "contentType", "post", "source", "origin"]


    def create(self, validated_data):
        validated_data["source"] = "http://31552.yeg.rac.sh"
        validated_data["origin"] = "http://31552.yeg.rac.sh"

        instance = super().create(validated_data)
        return instance

class remoteLikesSerializer(serializers.ModelSerializer):
    source = serializers.CharField(default="http://31552.yeg.rac.sh")
    origin = serializers.CharField(default="http://31552.yeg.rac.sh")

    class Meta:
        model = Like
        fields = ["id", "summary", "author", "post", "comment", "source", "origin"]

    def create(self, validated_data):
        validated_data["source"] = "http://31552.yeg.rac.sh"
        validated_data["origin"] = "http://31552.yeg.rac.sh"

        instance = super().create(validated_data)
        return instance
