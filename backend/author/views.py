from rest_framework.views import APIView
from .serializers import AuthorSerializer
from rest_framework.response import Response
from django.views.decorators.http import require_http_methods
from drf_spectacular.utils import extend_schema
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Author

User = get_user_model()

class SignUpView(APIView):
    @extend_schema(request=AuthorSerializer, responses=AuthorSerializer)
    def get(self, request, pk, format=None):
        """
        Returns information for the author.
        """
        authorId = pk
        if authorId:
            try:
                user = User.objects.get(pk=authorId)
            except User.DoesNotExist:
                return Response({'detail': 'Author not found.'}, status=status.HTTP_404_NOT_FOUND)
            author = Author.objects.get(pk=authorId)


            serializer = AuthorSerializer(author)
            return Response(serializer.data)
        else:
            return Response({'detail': 'ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        
    @extend_schema(request=AuthorSerializer, responses=AuthorSerializer)
    def post(self, request):
        """
        Creates the author.
        """
        
        serializer = AuthorSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        serializer.save()
        return Response(serializer.data)
    
    @extend_schema(request=AuthorSerializer, responses=AuthorSerializer)
    def delete(self, request, pk, format=None):
        """
        Deletes the author.
        """
        
        author = Author.objects.get(pk=pk)
        author.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

