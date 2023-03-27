from rest_framework import serializers
from .models import Post, Comment, Like
from author.serializers import AuthorPostSerializer


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "author_id", "author_name", "title", "description", "body", "visibility", "datePublished", "contentType", "image_file", "image_url", "remote_id"]

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

