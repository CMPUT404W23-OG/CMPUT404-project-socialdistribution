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
 
# class remoteInboxSerializer(serializers.Serializer):
#     type = serializers.CharField()
#     if type == 'Follow':
#         summary = serializers.CharField()
#         actor = {
#             "type": "author",
#             "id": serializers.CharField(),
#             "url": serializers.CharField(),
#             "host": serializers.CharField(),
#             "displayName": serializers.CharField(),
#             "github": serializers.CharField(),
#             "profileImage": serializers.CharField(),
#         },
#         object = {
#             "type": "author",
#             "id": serializers.CharField(),
#             "url": serializers.CharField(),
#             "host": serializers.CharField(),
#             "displayName": serializers.CharField(),
#             "github": serializers.CharField(),
#             "profileImage": serializers.CharField(),
#         }
    
#     elif type == 'Post':    
#         title = serializers.charField()
#         source = serializers.charField()
#         origin = serializers.charField()
#         description = serializers.charField()
#         contentType = serializers.charField()
#         content = serializers.charField()
#         author = {
#             "type": "author",
#             "id": serializers.CharField(),
#             "url": serializers.CharField(),
#             "host": serializers.CharField(),
#             "displayName": serializers.CharField(),
#             "github": serializers.CharField(),
#             "profileImage": serializers.CharField(),
#         },
        
#         categories = serializers.ListField()
#         published = serializers.DateTimeField()
#         visibility = serializers.CharField()
#         unlisted = serializers.BooleanField()

#     elif type == 'Comment':
#         author = {
#             "type": "author",
#             "id": serializers.CharField(),
#             "url": serializers.CharField(),
#             "host": serializers.CharField(),
#             "displayName": serializers.CharField(),
#             "github": serializers.CharField(),
#             "profileImage": serializers.CharField(),
#         },
#         comment = serializers.CharField()
#         contentType = serializers.CharField()
#         published = serializers.DateTimeField()
#         id = serializers.CharField()

#     elif type == 'liked':
#         items = [
#             {
#             "@context": serializers.CharField(),
#             "summary": serializers.CharField(),
#             "type": "Like",
#             "author": {
                
#                 "type": "author",
#                 "id": serializers.CharField(),
#                 "url": serializers.CharField(),
#                 "host": serializers.CharField(),
#                 "displayName": serializers.CharField(),
#                 "github": serializers.CharField(),
#                 "profileImage": serializers.CharField(),
#             },
#             "object": serializers.CharField()
#             }
#         ]

class remotePostsSerializer(serializers.ModelSerializer):
    source = serializers.CharField(default="http://31552.yeg.rac.sh")
    origin = serializers.CharField(default="http://31552.yeg.rac.sh")
    author = remoteAuthorSerializer(source="author_id")


    class Meta:
        model = Post
        fields = ["title", "id", "source", "origin", "description", "contentType", "content", "author"   , "categories", "published", "visibility", "unlisted"]
        extra_kwargs = {
           
            "published": {"source": "datePublished"},
            "content" :{"source": "description"},

       
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
