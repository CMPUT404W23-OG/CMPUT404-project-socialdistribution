from rest_framework import serializers
from .models import Post, Comment, Like, Author
from author.serializers import AuthorPostSerializer


class PostSerializer(serializers.ModelSerializer):
    author_image_url = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ["id", "author_id", "author_name","author_image_url", "title", "description", "body", "visibility", "datePublished", "contentType", "image_file", "image_url", "remote_id"]

    def get_author_image_url(self, obj):
        return obj.author_id.profile_image_url
        

class CommentSerializer(serializers.ModelSerializer):
    author = AuthorPostSerializer()
    class Meta:
        model = Comment
        fields = ["id", "author", "comment", "contentType", "post"]

class CommentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = fields = ["id", "author", "comment", "contentType", "post"]

class LikeSerializer(serializers.ModelSerializer):
    author = AuthorPostSerializer()
    class Meta:
        model = Like
        fields = ["id", "summary", "author", "post", "comment"]

class LikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "summary", "author", "post", "comment"]

