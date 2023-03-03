from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "author_id", "author_name", "title", "description", "body", "visibility", "datePublished", "contentType", "image_file", "image_url"]
