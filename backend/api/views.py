import logging
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
import base64
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Incoming_Node, Outgoing_Node
from .serializers import remoteAuthorsSerializer
from author.models import Author

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @extend_schema(responses=TokenObtainPairSerializer)
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@extend_schema(responses=MyTokenObtainPairSerializer)
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


class remoteUserView(APIView):
    
    def authenticate_node(self,request):
        if 'HTTP_AUTHORIZATION' in request.META:
            auth = request.META['HTTP_AUTHORIZATION'].split()
            if len(auth) == 2:
                if auth[0].lower() == "basic":
                    uname, passwd = base64.b64decode(auth[1]).decode().split(':')
                    user = Incoming_Node.objects.filter(Username=uname, Password=passwd)
                    logging.debug("found user *************" + str(user) + "*************")
                    if user:
                        return True
        return False
    
    def get(self, request):
        if self.authenticate_node(request):
            authors = Author.objects.all()
            serializer = remoteAuthorsSerializer(authors, many=True)
            return Response({"type" : "authors", "items" :serializer.data },  status=200)
        else:
            return Response('Not Authenticated')

