from django.test import TestCase
from .models import Post
from datetime import datetime
from .models import Post, Comment, Likes
from author.models import Author

## TODO Add tests 
## These test needs fixing

# class PostModelTestCase(TestCase):
    
#     def setUp(self):
#         self.author = Author.objects.create(username='testuser')
#         self.post = Post.objects.create(
#             title='Test Post',
#             author_name='testuser',
#             author_id=self.author,
#             description='This is a test post.',
#             body='Test post content.',
#         )

#     def test_post_creation(self):
#         post = Post.objects.get(id=1)
#         self.assertEqual(post.title, 'Test Post')
#         self.assertEqual(post.author_name, 'testuser')
#         self.assertEqual(post.author_id, self.author)
#         self.assertEqual(post.description, 'This is a test post.')
#         self.assertEqual(post.body, 'Test post content.')


# class PostCommentTest(TestCase):
#     def setUp(self):
#         # Create an author
#         self.author = Author.objects.create(username='testauthor')

#         # Create a post
#         self.post = Post.objects.create(
#             title='Test Post',
#             author_name='testauthor',
#             description='Test post description',
#             body='Test post body',
#             author_id=self.author
#         )

#     def test_comment_creation(self):
#         # Create a comment for the post
#         comment = Comment.objects.create(
#             author=self.author,
#             comment='Test comment',
#             contentType='text/markdown',
#             post=self.post
#         )

#         # Check if the comment was created
#         self.assertEqual(comment.author, self.author)
#         self.assertEqual(comment.comment, 'Test comment')
#         self.assertEqual(comment.contentType, 'text/markdown')
#         self.assertEqual(comment.post, self.post)


# class LikesModelTestCase(TestCase):
#     def setUp(self):
#         self.author = Author.objects.create(
#             username='testuser',
#             password='testpass',
#             first_name='Test',
#             last_name='User'
#         )
#         self.post = Post.objects.create(
#             title='Test Post',
#             author_name=self.author.username,
#             author_id=self.author,
#             description='This is a test post',
#             body='This is the body of the test post'
#         )

#     def test_create_like(self):
#         like = Likes.objects.create(
#             summary='Test Like',
#             author=self.author,
#             post=self.post
#         )
#         self.assertEqual(like.summary, 'Test Like')
#         self.assertEqual(like.author, self.author)
#         self.assertEqual(like.post, self.post)

