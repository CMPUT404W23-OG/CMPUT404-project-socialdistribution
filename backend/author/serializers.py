from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "username", "password", "email","githubId", "profile_image_url", "host", "url"]
        
        
    def create(self, validated_data):
        author = Author.objects.create(username=validated_data['username'],  
                                       githubId=validated_data['githubId'], 
                                       email=validated_data['email'],
                                       url='http://localhost:8000/author/'
                                       )

        author.set_password(validated_data['password'])
        author.save()
        
        return author

