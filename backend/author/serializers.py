from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["username", "password", "email","githubId", "profile_image_url", "host", "url"]
        
        
    def create(self, validated_data):
        author = Author.objects.create(username=validated_data['username'],  
                                       githubId=validated_data['githubId'], 
                                       email=validated_data['email'])

        author.set_password(validated_data['password'])
        author.save()
        
        return author

