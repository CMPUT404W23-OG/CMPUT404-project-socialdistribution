from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "username", "password"]
        
        
    def create(self, validated_data):
        author = Author.objects.create(username=validated_data['username'],)

        author.set_password(validated_data['password'])
        author.save()
        
        return author

