from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "username", "password","githubId", "profile_image_url", "host", "url"]

class AuthorPostSerializer(serializers.ModelSerializer):
    '''
    New author serializer for get and post requests in the Post model. Required to avoid password being returned in the response.
    '''
    class Meta:
        model = Author
        fields = ["id", "username","githubId", "profile_image_url", "host", "url"]      
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        author = Author.objects.create(
                                       username=validated_data['username'],  
                                       githubId=validated_data['githubId'],
                                       
                                       )

        author.set_password(validated_data['password'])
        author.save()
        
        return author

