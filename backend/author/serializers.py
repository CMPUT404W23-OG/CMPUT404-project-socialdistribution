from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["username", "password", "first_name", "last_name", "email","githubId"]
        
        
    def create(self, validated_data):
        author = Author.objects.create(username=validated_data['username'], 
                                       first_name=validated_data['first_name'], 
                                       last_name=validated_data['last_name'], 
                                       githubId=validated_data['githubId'], 
                                       email=validated_data['email'])

        author.set_password(validated_data['password'])
        author.save()
        
        return author

