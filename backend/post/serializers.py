from rest_framework import serializers
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "author_id", "author_name", "title", "description", "body", "visibility", "datePublished", "contentType", "image_file", "image_url"]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "author", "comment", "contentType", "post"]

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "summary", "author", "post", "comment"]

