import logging
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter, OpenApiResponse
from django.core.paginator import Paginator
from rest_framework.views import APIView
import base64
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Incoming_Node, Outgoing_Node
from .serializers import remoteAuthorsSerializer, remoteAuthorSerializer,  remotePostsSerializer, remoteCommentsSerializer, remoteLikesSerializer
from author.models import Author
from follow.models import Follow, Request
from post.models import Post, Comment, Like

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
        
class remoteFollowersDetailView(APIView):
    
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
    
    
    @extend_schema( operation_id= "remote following detail", responses= remoteAuthorSerializer )
    def get(self, request,AUTHOR_ID, FOLLOWER_ID,  format=None):
        '''Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID 
        SUCCESS: 200 OK, {"type": "following", "items": [AUTHOR OBJECT]},
        FAILURE: 404 NOT FOUND, {"type": "following", "items": []}'''
      
        if self.authenticate_node(request):
            
            author = Author.objects.get(pk = AUTHOR_ID)

            # check if the foreign author object exists in the database
            try:
                foreign_author = Author.objects.get(pk = FOLLOWER_ID)
            except Author.DoesNotExist:
                return Response({"type" : "following", "items" : [] },  status=404)


            # CHECK IF THE FOREIGN AUTHOR IS A FOLLOWER OF THE AUTHOR
            following = Follow.objects.is_following(foreign_author, author)
            if following:
                serializer = remoteAuthorSerializer(foreign_author)
                return Response({"type" : "followers", "items" : [serializer.data] },  status=200)
            
            return Response({"type" : "followers", "items" : [] },  status=404)

        else:
            return Response({"error" : "Unauthorized"},  status=401)

class remotePostsListView(APIView):

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
            
            description=' List of posts from remote server'),
        401: OpenApiResponse(
            
            description='Unauthorized',
            )
        }
    )
    def get(self, request, AUTHOR_ID, format=None):
        '''Get all posts from remote server'''
      
        if self.authenticate_node(request):
            posts = Post.objects.all().filter(author_id = AUTHOR_ID)
            number = self.request.query_params.get('page', 1)
            size = self.request.query_params.get('size', 5)
            paginator = Paginator(posts, size)

            serializer = remotePostsSerializer(paginator.page(number) , many=True)
            return Response({"type" : "posts", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)     

class remotePostDetailView(APIView):

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
    
    
    @extend_schema( operation_id= "remote post detail", responses= remotePostsSerializer )
    def get(self, request, AUTHOR_ID, POST_ID, format=None):
        '''Get a post with a given id from remote server'''
      
        if self.authenticate_node(request):
            post = Post.objects.get(pk = POST_ID)
            
            serializer = remotePostsSerializer(post)
            return Response({"type" : "post", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)

class remoteCommentsListView(APIView):

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
            
            description=' List of comments from remote server for a given post'),
        401: OpenApiResponse(
            
            description='Unauthorized',
            )
        }
    )
    def get(self, request, AUTHOR_ID, POST_ID, format=None):
        '''Get all comments from remote server for a given post'''
      
        if self.authenticate_node(request):
            comments = Comment.objects.all().filter(post_id = POST_ID)
            number = self.request.query_params.get('page', 1)
            size = self.request.query_params.get('size', 5)
            paginator = Paginator(comments, size)

            serializer = remoteCommentsSerializer(paginator.page(number) , many=True)
            return Response({"type" : "comments", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)


class remoteLikesListView(APIView):

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
            
            description=' List of likes from remote server for a given post'),
        401: OpenApiResponse(
            
            description='Unauthorized',
            )
        }
    )
    def get(self, request, AUTHOR_ID, POST_ID, format=None):
        '''Get all likes from remote server for a given post'''
      
        if self.authenticate_node(request):
            likes = Like.objects.all().filter(post_id = POST_ID)
            number = self.request.query_params.get('page', 1)
            size = self.request.query_params.get('size', 5)
            paginator = Paginator(likes, size)

            serializer = remoteLikesSerializer(paginator.page(number) , many=True)
            return Response({"type" : "likes", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)

class remoteCommentLikesListView(APIView):

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
            
            description=' List of likes from remote server for a given comment'),
        401: OpenApiResponse(
            
            description='Unauthorized',
            )
        }
    )
    def get(self, request, AUTHOR_ID, POST_ID, COMMENT_ID, format=None):
        '''Get all likes from remote server for a given comment'''
      
        if self.authenticate_node(request):
            likes = Like.objects.all().filter(comment_id = COMMENT_ID)
            number = self.request.query_params.get('page', 1)
            size = self.request.query_params.get('size', 5)
            paginator = Paginator(likes, size)

            serializer = remoteLikesSerializer(paginator.page(number) , many=True)
            return Response({"type" : "likes", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)

class remoteAuthorLikesListView(APIView):

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
            
            description=' List of likes from remote server for a given author'),
        401: OpenApiResponse(
            
            description='Unauthorized',
            )
        }
    )
    def get(self, request, AUTHOR_ID, format=None):
        '''Get all likes from remote server for a given author'''
      
        if self.authenticate_node(request):
            likes = Like.objects.all().filter(author_id = AUTHOR_ID)
            number = self.request.query_params.get('page', 1)
            size = self.request.query_params.get('size', 5)
            paginator = Paginator(likes, size)

            serializer = remoteLikesSerializer(paginator.page(number) , many=True)
            return Response({"type" : "likes", "items" :serializer.data },  status=200)
        else:
            return Response({"error" : "Unauthorized"},  status=401)

class remoteInboxView(APIView):
    
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
    
    @extend_schema(request= remotePostDetailView,
                   examples=[OpenApiExample(
                    
                    name='Post follow request, Post, comment, like to remote server',
                    summary='Post follow request, Post, comment, like to remote server',
                    value={
                        
                    },
                    description='Post follow request, Post, comment, like to remote server, Use same body as what you would GET from post, comment, like, follow request' ,
                    )],
    responses={
        200: OpenApiResponse(
            
            description=' Success Inbox received'),
        401: OpenApiResponse(
            
            description='Unauthorized',
            )
        })
    
    def post(self, request,AUTHOR_ID, format=None):
        '''Post follow request, Post, comment, like to remote server'''
        if self.authenticate_node(request):
    
            data = request.data
            # if data["type"] == "post":
            #     logging.debug("post received")
            #     try:
            #         logging.debug("trying to get post data")

            #         title = data["title"]
            #         id = data["id"]
            #         source = data["source"]
            #         origin = data["origin"]
            #         description = data["description"]
            #         contentType = data["contentType"]
            #         content = data["content"]
            #         author = data["author"]
            #         categories = data["categories"]
      
            #         logging.debug("got post data ******")

            #         # create a post from the remote author

            #         try:
            #             remote_author = Author.objects.get(remote_id = author["id"])

            #         except:
            #             remote_author = []
                    
            #         if remote_author == []:
            #             logging.debug("creating remote author")
            #             remote_author = Author.objects.createAuthor(
            #                                             username=author["displayName"] + " - Remote User",
            #                                             password=None,
            #                                             host=author["host"],
            #                                             url=author["url"],
            #                                             githubId=author["github"],
            #                                             profile_image_url=author["profileImage"],
            #                                             api_user=True,
            #                                             remote_id = author["id"],
            #                                             remote_name = author["displayName"]
            #                                     )
            #         post = Post.objects.create(
            #             title=title,
            #             author_name=remote_author.username,
            #             author_id = remote_author,
            #             description=description,
            #             content=content,
            #             contentType=contentType,
            #             categories=categories,
            #         )

            #         post.save()
            #         return Response({"success" : "post received"},  status=200)

            #     except:
            #         return Response({"error" : "invalid post"},  status=400)
            if data["type"] == "Follow":
                try:
                    summary = data["summary"]
                    actor = data["actor"]
                    object = data["object"]

                    # create a follow request from the remote author
                    local_author = Author.objects.get(id = AUTHOR_ID)
                    try:
                        remote_author = Author.objects.get(remote_id = actor["id"])
                    except:
                        remote_author = []
                    if remote_author == []:
                        remote_author = Author.objects.createAuthor(
                                                        username=actor["displayName"] + " - Remote User",
                                                        password=None,
                                                        host=actor["host"],
                                                        url=actor["url"],
                                                        githubId=actor["github"],
                                                        profile_image_url=actor["profileImage"],
                                                        api_user=True,
                                                        remote_id = actor["id"],
                                                        remote_name = actor["displayName"]
                                                )

                    follow_request = Request.objects.create(follower=remote_author, following=local_author)
                    follow_request.save()


                    return Response({"success" : "follow received"},  status=200)
                except:
                    return Response({"error" : "invalid follow"},  status=400)
                
            # elif data["type"] == "comment":
            #     try:
              
            #         author = data["author"]
            #         comment = data["comment"]
            #         contentType = data["contentType"]
            #         published = data["published"]
            #         id = data["id"]

            #     except:
            #         return Response({"error" : "invalid comment"},  status=400)
                
            # elif data["type"] == "Like":
            #     try:
            #         summary = data["summary"]
            #         author = data["author"]
            #         object = data["object"]

            #         logging.debug("data is " + str(data))
            #         return Response({"success" : "like received"},  status=200)
            #     except:
            #         return Response({"error" : "invalid like"},  status=400)
            
            # return Response({"Invalid data"},  status=400)
        else:
            return Response({"error" : "Unauthorized"},  status=401)
    
        

   
#     def get(self, request,  format=None):
#         '''Get all posts from remote server'''
      
#         pass