from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from .models import AlreadyExistError

from .serializers import FollowSerializer, RequestSerializer, FriendSerializer, FollowPostSerializer, RequestPostSerializer
from .models import Follow, Request
from drf_spectacular.utils import extend_schema

User = get_user_model()

class FollowingList(APIView):
    """
    Get a list of users that this user is following.
    """
    @extend_schema(responses=FollowSerializer)
    def get(self, request,Email, format=None):
        email = Email
        if email:
            try:
                user = User.objects.get(email=email)
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
    @extend_schema(responses=FollowSerializer)
    def get(self, request, Email,format=None):
        email = Email
        if email:
            try:
                user = User.objects.get(email =email)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            follows = Follow.objects.get_followers(user)
            serializer = FollowSerializer(follows, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Email parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)


class FollowDetail(APIView):
    
    
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
    

    
class RequestListReceived(APIView):
    """
    Get All follow requests sent to a user
    """
    @extend_schema(responses=RequestSerializer)
    def get(self, request,Email, format=None):

        email = Email
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            requests = Request.objects.filter(following=user)
            serializer = RequestSerializer(requests, many=True)
            return Response(serializer.data)

        requests = Request.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)


class RequestListSent(APIView):
    """
    Get All follow requests sent by a user
    """
    @extend_schema(responses=RequestSerializer)
    def get(self,request, Email ,format=None):

        email = Email
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            requests = Request.objects.filter(follower=user)
            serializer = RequestSerializer(requests, many=True)
            return Response(serializer.data)

        requests = Request.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)


    
class RequestDetail(APIView):


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
        """

        # Approve is a boolean value
        Approve = request.data.get('Approve')

        if Approve:
            request = self.get_object(pk)
            request.accept()
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            request = self.get_object(pk)
            request.reject()
            return Response(status=status.HTTP_204_NO_CONTENT)
        

class FriendList(APIView):
    """
    List all true friends for a given user.
    """

    @extend_schema(request=FriendSerializer ,responses=FriendSerializer)
    def get(self, request,Email, format=None):
        email = Email
        
        if email:
            try:
                user = User.objects.get(email=email)
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
    """
    @extend_schema(request=FollowPostSerializer,responses=FollowPostSerializer)
    def post(self, request,  format=None):
        follower = request.data.get('follower')
        following = request.data.get('following')

        if follower and following:
            try:
                follower = User.objects.get(email=follower)
            except User.DoesNotExist:
                return Response({'detail': 'Follower not found.'}, status=status.HTTP_404_NOT_FOUND)
            try:
                following = User.objects.get(email=following)
            except User.DoesNotExist:
                return Response({'detail': 'Following not found.'}, status=status.HTTP_404_NOT_FOUND)
        
            try:
                follow_post = Follow.objects.send_follow_request(follower=follower, following=following)
                serializer = FollowPostSerializer(follow_post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except AlreadyExistError:
                return Response({'detail': 'Follow request already exist.'}, status=status.HTTP_400_BAD_REQUEST)
     
        else:
            return Response({'detail': 'Follower and Following not found.'}, status=status.HTTP_404_NOT_FOUND)
        
