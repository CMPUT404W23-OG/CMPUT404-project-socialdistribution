from rest_framework import serializers
from author.models import Author
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
    



 