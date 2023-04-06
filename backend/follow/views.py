import datetime
from requests.auth import HTTPBasicAuth
import pytz
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from author.models import Author
from post.models import Post
import logging
from .models import AlreadyExistError

from .serializers import FollowSerializer, RequestSerializer, FriendSerializer, FollowPostSerializer, RequestPostSerializer
from .models import Follow, Request
from drf_spectacular.utils import extend_schema
import threading
import requests
from api.models import Incoming_Node, Outgoing_Node
from rest_framework.permissions import IsAuthenticated
User = get_user_model()


class FollowingList(APIView):
    """
    Get a list of users that this user is following.
    """
    permission_classes = (IsAuthenticated,)

    @extend_schema(responses=FollowSerializer)
    def get(self, request,pk, format=None):
    
        if pk:
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            follows = Follow.objects.get_following(user)
            serializer = FollowSerializer(follows, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Email parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
class FollowersList(APIView):
    """
    Get a list of users that are following this user.
    """
    permission_classes = (IsAuthenticated,)

    @extend_schema(responses=FollowSerializer)
    def get(self, request, pk,format=None):
    
        if pk:
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            follows = Follow.objects.get_followers(user)
            serializer = FollowSerializer(follows, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Email parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)


class FollowDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk):
 
        try:
            return Follow.objects.get(pk=pk)
        except Follow.DoesNotExist:
            raise Http404
        
    @extend_schema(request=FollowSerializer ,responses=FollowSerializer)
    def get(self, request, pk, format=None):
        """
        Retrieve a follow instance.
        """
        follow = self.get_object(pk)
        serializer = FollowSerializer(follow)
        return Response(serializer.data)


    @extend_schema(request=FollowSerializer,responses=FollowSerializer)
    def delete(self, request, pk, format=None):
        """
        Delete a follow instance.
        """
        follow = self.get_object(pk)
        follow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
def getGithubActivity(self, author_id):
# get the latest post (only one) with title = "Github Activity from the database with latest datePublished "
    
    try:
        post = Post.objects.filter(title="Github Activity", author_id=author_id).latest('dateEdited')
        logging.debug("Github Activity Post: " + str(post))
    except Post.DoesNotExist:
        post = None
    # logging.debug(" getting post "+ post ) if post != "none" else logging.debug("no post found")
    post_date = -1
    if post :
        
        post_date = post.dateEdited
        # logging.debug("Github Activity Post: " + post_date)
        # logging.debug("Github Activity Post Date: " + post_date.isoformat())
    # Make a github call to get the latest activity since post_date for a specific author
    username = Author.objects.get(id=author_id).githubId
    url = "https://api.github.com/users/" + username + "/events?per_page=10"

    logging.debug("Github Activity URL: " + url)
    response = requests.get(url)
    author_model = Author.objects.get(pk=author_id)
    if response.status_code == 200:
        events = response.json()
        # for each event, create a post with title = "Github Activity" and description = commit message
        for event in events:
            
            if post_date != -1:
                if datetime.datetime.strptime(event['created_at'],'%Y-%m-%dT%H:%M:%SZ' ).replace(tzinfo=pytz.UTC)    <= post_date:
                    continue

            if event['type'] == "PushEvent":
                post = Post.objects.create (
                    title="Github Activity",
                    description= "Push Event",
                    body= "Commit : " + event['payload']['commits'][0]['message'] + " to " + event['repo']['name'] ,
                    author_id= author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,
                    unlisted=False )
                post.save()

            elif event['type'] == "CreateEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description= "CreateEvent",
                    body="Created a " + event['payload']['ref_type'] + " named " + event['payload']['ref']   ,
                    author_name= author_model.username,
                    author_id= author_model,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,
                    unlisted=False)
                post.save()
            
            elif event['type'] == "DeleteEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="DeleteEvent",
                    body="Deleted a " + event['payload']['ref_type'] + " named " + event['payload']['ref']   , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,  
                    unlisted=False)
                post.save()

            elif event['type'] == "ForkEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="ForkEvent",
                    body="Forked a repository from " + event['repo']['name']   , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,   
                    unlisted=False)
                post.save()
            
            elif event['type'] == "IssuesEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="IssuesEvent",
                    body="Created an issue for " + event['repo']['name']   , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,   
                    unlisted=False)
                post.save()
            
            elif event['type'] == "IssueCommentEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="IssueCommentEvent",
                    body="Commented on an issue for " + event['repo']['name']   , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,   
                    unlisted=False)
                post.save()
            
            elif event['type'] == "PullRequestEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="PullRequestEvent",
                    body="Created a pull request for " + event['repo']['name']   , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] , 
                    unlisted=False)
                post.save()
            
            elif event['type'] == "PullRequestReviewCommentEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="PullRequestReviewCommentEvent",
                    body="Commented on a pull request for " + event['repo']['name']  , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,    
                    unlisted=False)
                post.save()

            elif event['type'] == "WatchEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="WatchEvent",
                    body="Starred a repository named " + event['repo']['name']  , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,  
                    unlisted=False)
                post.save()

            elif event['type'] == "ReleaseEvent":
                post = Post.objects.create(
                    title="Github Activity",
                    description="ReleaseEvent",
                    body="Created a release for " + event['repo']['name'] , 
                    author_id=author_model,
                    author_name= author_model.username,
                    contentType="text/plain",
                    visibility="PUBLIC",
                    dateEdited= event['created_at'] ,  
                    unlisted=False)
                post.save()
            
        

        # logging.debug("Github Activity Events: " + str(events))
    
class RequestListReceived(APIView):
    """
    Get All follow requests sent to a user
    """
    permission_classes = (IsAuthenticated,)

    @extend_schema(responses=RequestSerializer)
    def get(self, request,pk, format=None):

        if pk:
            
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            requests = Request.objects.filter(following=user)
            serializer = RequestSerializer(requests, many=True)
            # this is a thread to get the github activity for the user, it will run in the background 
            thread = threading.Thread(target=getGithubActivity, args=(self, pk))
            thread.start()
            return Response(serializer.data)

        requests = Request.objects.all()
        serializer = RequestSerializer(requests, many=True)
    
        return Response(serializer.data)


class RequestListSent(APIView):
    """
    Get All follow requests sent by a user
    """
    permission_classes = (IsAuthenticated,)

    @extend_schema(responses=RequestSerializer)
    def get(self,request, pk ,format=None):

        
        if pk:
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            requests = Request.objects.filter(follower=user)
            serializer = RequestSerializer(requests, many=True)
            return Response(serializer.data)

        requests = Request.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)


    
class RequestDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk):
        try:
            return Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            raise Http404

    @extend_schema(request=RequestSerializer, responses=RequestSerializer)
    def get(self, request, pk, format=None):
        """
        Retrieve a request instance.
        """
        request = self.get_object(pk)
        serializer = RequestSerializer(request)
        return Response(serializer.data)


    @extend_schema(request=RequestSerializer, responses=RequestSerializer)
    def delete(self, request, pk, format=None):
        """
        Delete a request instance.
        """
        request = self.get_object(pk)
        request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(request=RequestPostSerializer, responses=RequestSerializer)
    def post(self, request,pk, format=None):
        """
        Accept or reject a request instance. {"Approve": true} accepts the request and {"Approve": false} rejects the request.
        {"Cancel": true} cancels the request. 
        """

        # Approve is a boolean value
        Approve = request.data.get('Approve')
        Cancel = request.data.get('Cancel')

        if Approve and Cancel:
            return Response({'detail': 'Approve and Cancel parameters cannot be true at the same time.'}, status=status.HTTP_400_BAD_REQUEST)

        if Approve and (not Cancel):
            request = self.get_object(pk)
            request.accept()
            return Response(status=status.HTTP_204_NO_CONTENT)

        elif (not Approve) and Cancel:
            request = self.get_object(pk)
            request.reject()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        else:
            return Response({'detail': 'Approve or Cancel parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        

class FriendList(APIView):
    """
    List all true friends for a given user.
    """
    permission_classes = (IsAuthenticated,)

    @extend_schema(request=FriendSerializer ,responses=FriendSerializer)
    def get(self, request,pk, format=None):
    
        
        if pk:
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            friends = Follow.objects.get_true_friends(user=user)
            serializer = FollowSerializer(friends, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class FollowPost(APIView):
    """
    Post a new follow request.
    input takes the ids of follower and following.
    """

    @extend_schema(request=FollowPostSerializer,responses=FollowPostSerializer)
    def post(self, request,  format=None):
        follower = request.data.get('follower')
        following = request.data.get('following')

        if follower and following:
            try:
                follower = User.objects.get(pk=follower)
            except User.DoesNotExist:
                return Response({'detail': 'Follower not found.'}, status=status.HTTP_404_NOT_FOUND)
            try:
                following = User.objects.get(pk=following)
            except User.DoesNotExist:
                return Response({'detail': 'Following not found.'}, status=status.HTTP_404_NOT_FOUND)
        
            try:
                # change follow.object
                follow_post = Follow.objects.send_follow_request(follower=follower, following=following)
                serializer = FollowPostSerializer(follow_post)
                thread = threading.Thread(target=self.sendFollowRequestRemote, args=(follower, following))
                thread.start()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except AlreadyExistError:
                return Response({'detail': 'Follow request already exist.'}, status=status.HTTP_400_BAD_REQUEST)
     
        else:
            return Response({'detail': 'Follower and Following not found.'}, status=status.HTTP_404_NOT_FOUND)
        

    def sendFollowRequestRemote(self, follower, following):
        """
        Send a follow request to a remote user.
        """
        # check the following has a remote id
        if following.remote_id:
            url = following.remote_id + "/inbox/"

            post_body = {
                "type": "Follow",
                "summary": follower.username + " wants to follow " + following.remote_name,
                "actor":{
                    "type" : "author",
                    "id" : follower.id,
                    "host":"http://31552.yeg.rac.sh",
                    "displayName": follower.username,
                    "url" : "http://31552.yeg.rac.sh/author/" + str(follower.id),
                    "github": "https://www.github.com/" + follower.githubId,
                    "profileImage" :follower.profile_image_url,
                },
                "object":{
                    "type" : "author",
                    "id" : following.remote_id,
                    "host":following.host,
                    "displayName": following.username,
                    "url" : following.url,
                    "github": following.githubId,
                    "profileImage" :following.profile_image_url,
                }
            }

            remote_nodes = Outgoing_Node.objects.all()
            node_url = None
            node_username = None
            node_password = None
            referer = None

            for node in remote_nodes:
                if following.host == node.url:
                    node_url = node.url
                    node_username = node.Username
                    node_password = node.Password
                    referer = node.url + "/"
                    break
                elif following.host + "/api" == node.url:
                    node_url = node.url
                    node_username = node.Username
                    node_password = node.Password
                    referer = node.url
                    break
            
            # send post request with basic auth header
            if node_url:
                get_cookies = requests.get(node_url + "/authors/", auth=HTTPBasicAuth(node_username, node_password))
                cookies = get_cookies.cookies
                
                # parse X-CSRFToken from cookies
                csrf_token = None
                for cookie in cookies:
                    if cookie.name == "csrftoken":
                        csrf_token = cookie.value
                        break


                headers = {"Referer": referer, "Content-Type": "application/json", "X-CSRFToken": csrf_token} 
                response = requests.post(url, json=post_body, auth=HTTPBasicAuth(node_username, node_password), headers=headers)
                if response.status_code == 200 or response.status_code == 201:
                    return True
                else:
                    # delete the follow request
                    sent_follow_request = Request.objects.get(follower=follower, following=following)
                    # sent_follow_request.delete()
                    return False

