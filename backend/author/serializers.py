from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["username", "password", "first_name", "last_name", "email",]
        
        
    def create(self, validated_data):
        author = Author.objects.create(username=validated_data['username'], first_name=validated_data['first_name'], last_name=validated_data['last_name'])

        author.set_password(validated_data['password'])
        author.save()
        
        return author

