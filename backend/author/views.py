from rest_framework.views import APIView
from .serializers import AuthorSerializer
from rest_framework.response import Response
from django.views.decorators.http import require_http_methods
from drf_spectacular.utils import extend_schema


class SignUpView(APIView):
    """
    Creates the user.
    """

    @extend_schema(request=AuthorSerializer  ,responses=AuthorSerializer)
    def post(self, request):
        serializer = AuthorSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        serializer.save()
        return Response(serializer.data)
