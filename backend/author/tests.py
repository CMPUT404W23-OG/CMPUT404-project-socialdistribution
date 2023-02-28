from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Author
from .serializers import AuthorSerializer


class AuthorSerializerTest(TestCase):


    # def test_author_serializer_create(self):
    #     serializer_data = {
    #         'username': 'testuser',
    #         'password': 'testpassword',
    #         'first_name': 'Test',
    #         'last_name': 'User',
    #         'email': 'testuser@example.com',
    #         'githubId': 'testuser123'
    #     }
        
    #     serializer = AuthorSerializer(data=serializer_data)
    #     self.assertTrue(serializer.is_valid())
    #     author = serializer.save()

    #     self.assertEqual(author.username, serializer_data['username'])
     
    #     self.assertEqual(author.last_name, serializer_data['last_name'])
    #     self.assertEqual(author.email, serializer_data['email'])
    #     self.assertEqual(author.githubId, serializer_data['githubId'])
    
    
    def test_author_serializer_invalid_data(self):

        serializer_data = {
            'username': 'testuser',
  
        }
        serializer = AuthorSerializer(data=serializer_data)

        # Test serializer with invalid data
        self.assertFalse(serializer.is_valid())




    def test_create_superuser(self):
        author_data = {
            'username': 'testadmin',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'Admin',
            'email': 'testadmin@example.com',
            'githubId': 'testadmin123'
        }

        admin = Author.objects.create_superuser(**author_data)
        self.assertEqual(admin.username, author_data['username'])
        self.assertEqual(admin.first_name, author_data['first_name'])
        self.assertEqual(admin.last_name, author_data['last_name'])
        self.assertEqual(admin.email, author_data['email'])
        self.assertEqual(admin.githubId, author_data['githubId'])
        self.assertTrue(admin.check_password(author_data['password']))
        self.assertFalse(admin.api_user)
        self.assertTrue(admin.is_active)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_get_profile_image_url(self):
        author_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'testuser@example.com',
            'githubId': 'testuser123',
            'profile_image_url': 'https://example.com/profile.jpg'
        }

        author = Author.objects.createAuthor(**author_data)
        self.assertEqual(author.get_profile_image_url(), author_data['profile_image_url'])
        
        author.profile_image_url = ''
        author.save()
        self.assertEqual(author.get_profile_image_url(), "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")