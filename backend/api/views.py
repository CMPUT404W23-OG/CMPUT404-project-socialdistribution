import logging
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter, OpenApiResponse

from rest_framework.views import APIView
import base64
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Incoming_Node, Outgoing_Node
from .serializers import remoteAuthorsSerializer, remoteAuthorSerializer
from author.models import Author
from follow.models import Follow, Request

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


class remoteUserListView(APIView):
    
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
    
    
    @extend_schema(
    responses={
        200: OpenApiResponse(
            description=' List of authors from remote server'),
        401: OpenApiResponse(
            description='Unauthorized',
            )
        }
    )
    def get(self, request,  format=None):
        '''Get all authors from remote server'''
      
        if self.authenticate_node(request):
            authors = Author.objects.all()
            serializer = remoteAuthorsSerializer(authors, many=True)
            return Response({"type" : "authors", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)


class remoteUserDetailView(APIView):


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

    @extend_schema(operation_id= "remote author detail", responses=remoteAuthorSerializer )
    def get(self, request,  AUTHOR_ID, format=None):
        '''Get Author with a given id from remote server'''
        logging.debug("*I am called*************")
        if self.authenticate_node(request):
            author = Author.objects.get(pk=AUTHOR_ID)
            logging.debug("found author *************" + str(author) + "*************")
            serializer = remoteAuthorSerializer(author)
            return Response(serializer.data ,  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)
        

class remoteFollowersListView(APIView):
    
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
    
    
    @extend_schema(
    responses={
        200: OpenApiResponse(
            description=' List of followers from remote server'),
        401: OpenApiResponse(
            description='Unauthorized',
            )
        }
    )
    def get(self, request,AUTHOR_ID,  format=None):
        '''Get all followers from remote server for a given author'''
      
        if self.authenticate_node(request):
            
            author = Author.objects.get(pk = AUTHOR_ID)
            # get a list of followers of the author
            followers = Follow.objects.get_followers(author)

            # for each follower, get the author object
            authors = []
            for follower in followers:
                authors.append(Author.objects.get(pk = follower.follower.id))
        
            serializer = remoteAuthorsSerializer(authors, many=True)
            return Response({"type" : "followers", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)     