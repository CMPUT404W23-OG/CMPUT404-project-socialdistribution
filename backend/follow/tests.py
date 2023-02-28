from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from unittest.mock import patch, MagicMock

from .models import Follow, Request, FollowManager, AlreadyExistError


class FollowModelTest(TestCase):

  
    def test_send_follow_request(self):

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")
        
        
        with patch.object(FollowManager, 'is_follow_request_sent', return_value=False), \
            patch.object(FollowManager, 'is_following', return_value=False):
            result = Follow.objects.send_follow_request(user1, user2)
        
        # test that follow request was sent
        self.assertEqual(result, Request.objects.get(follower=user1, following=user2))


    def test_send_follow_request_already_sent(self): 

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")

        with patch.object(FollowManager, 'is_follow_request_sent', return_value=True), \
            patch.object(FollowManager, 'is_following', return_value=False):
            
            # test that follow request was not sent and AlreadyExistError was raised
            with self.assertRaises(AlreadyExistError):
                Follow.objects.send_follow_request(user1, user2)
                

    

    def test_send_follow_request_already_following(self): 

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")

        with patch.object(FollowManager, 'is_follow_request_sent', return_value=False), \
            patch.object(FollowManager, 'is_following', return_value=True):
             
            # test that follow request was not sent and AlreadyExistError was raised
            with self.assertRaises(AlreadyExistError):
                Follow.objects.send_follow_request(user1, user2)

    
    def test_send_follow_request_self(self):

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
    
        with patch.object(FollowManager, 'is_follow_request_sent', return_value=False), \
            patch.object(FollowManager, 'is_following', return_value=False):

            # test that follow request was not sent and ValidationError was raised
            with self.assertRaises(ValidationError):
                Follow.objects.send_follow_request(user1, user1)

    def test_unfollow(self):

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")

        with patch.object(FollowManager, 'is_following', return_value=True):
            Follow.objects.unfollow(user1, user2)

        # test that user1 is not following user2
        self.assertFalse(Follow.objects.is_following(user1, user2))


    def test_get_followers(self):

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")

        # test that user1 has no followers
        self.assertEqual(Follow.objects.get_followers(user1).count(), 0)

        # test that user2 has no followers
        self.assertEqual(Follow.objects.get_followers(user2).count(), 0)

        # user2 follows user1
        Follow.objects.create(follower=user2, following=user1)

        # test that user1 has 1 follower
        self.assertEqual(Follow.objects.get_followers(user1).count(), 1)


    def test_get_following(self):

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")

        # test that user1 has no followers
        self.assertEqual(Follow.objects.get_followers(user1).count(), 0)

        # test that user2 has no followers
        self.assertEqual(Follow.objects.get_followers(user2).count(), 0)

        # user2 follows user1
        Follow.objects.create(follower=user2, following=user1)

        # test that user2 is following user1
        self.assertEqual(Follow.objects.get_following(user2).count(), 1)


    def test_true_friends(self):

        user1 = get_user_model().objects.createAuthor(username='user1', password='password', first_name='user1', last_name='user1', email= "abc@abc.com")
        user2 = get_user_model().objects.createAuthor(username='user2', password='password', first_name='user2', last_name='user2', email= "def@def.com")

        # user2 follows user1
        Follow.objects.create(follower=user2, following=user1)

        # user1 follows user2
        Follow.objects.create(follower=user1, following=user2)

        # test that user1 has 1 true friend
        self.assertEqual(len(Follow.objects.get_true_friends(user1)), 1)
