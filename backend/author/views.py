from rest_framework.views import APIView
from .serializers import AuthorSerializer
from rest_framework.response import Response
from django.views.decorators.http import require_http_methods
from drf_spectacular.utils import extend_schema
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Author
from rest_framework.pagination import LimitOffsetPagination
from django.core.paginator import Paginator

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
    
class AuthorList(APIView):


    @extend_schema(request=AuthorSerializer, responses=AuthorSerializer)
    def get(self, request):
        """
        Returns all authors, can be used with pagination.
        
        Example: This will return the second page of authors if there are 3 authors per page
        http://localhost:8000/authors/all?page=2&size=3 
        
        """
        authors = Author.objects.all().order_by('id')
        
        number = self.request.query_params.get('page', 1)
        size = self.request.query_params.get('size', 5)

        paginator = Paginator(authors, size)
        serializer = AuthorSerializer(paginator.page(number), many=True)

        return Response(serializer.data)


