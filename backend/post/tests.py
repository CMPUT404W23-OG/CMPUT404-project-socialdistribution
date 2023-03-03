from django.test import TestCase
from .models import Post
from datetime import datetime
from .models import Post, Comment, Likes
from author.models import Author

#Write a test to check if the post is created

class PostTestCase(TestCase):
    def setUp(self):
        self.author = Author.objects.create(name='Test Author')
        self.post = Post.objects.create(
            title='Test Post',
            author_name=self.author.name,
            author_id=self.author,
            description='Test Description',
            body='Test Body'
        )

    def test_post_creation(self):
        self.assertTrue(isinstance(self.post, Post))
        self.assertEqual(self.post.__str__(), self.post.title)
        self.assertEqual(self.post.author_name, self.author.name)
        self.assertEqual(self.post.author_id, self.author)
        self.assertEqual(self.post.description, 'Test Description')
        self.assertEqual(self.post.body, 'Test Body')
        self.assertEqual(self.post.public, True)
        self.assertEqual(self.post.type, 'post')
        self.assertEqual(self.post.contentType, 'text/plain')
        self.assertEqual(self.post.visibility, 'PUBLIC')
        self.assertEqual(self.post.unlisted, False)
        self.assertListEqual(self.post.categories, [])
        self.assertIsInstance(self.post.datePublished, datetime)
        self.assertIsInstance(self.post.dateEdited, datetime)


class CommentTestCase(TestCase):
    def setUp(self):
        self.author = Author.objects.create(name='Test Author')
        self.post = Post.objects.create(
            title='Test Post',
            author_name=self.author.name,
            author_id=self.author,
            description='Test Description',
            body='Test Body'
        )
        self.comment = Comment.objects.create(
            author=self.author,
            comment='Test Comment',
            post=self.post
        )

    def test_comment_creation(self):
        self.assertTrue(isinstance(self.comment, Comment))
        self.assertEqual(self.comment.__str__(), self.comment.comment)
        self.assertEqual(self.comment.author, self.author)
        self.assertEqual(self.comment.comment, 'Test Comment')
        self.assertEqual(self.comment.contentType, 'text/markdown')
        self.assertEqual(self.comment.post, self.post)
        self.assertIsInstance(self.comment.published, datetime)

    def test_comment_post_association(self):
        self.assertEqual(self.comment.post, self.post)
        self.assertIn(self.comment, self.post.comment_set.all())

class TestLikes(TestCase):

    def setUp(self):
        # create a user
        self.user = Author.objects.create(displayName='test user')
        # create a post
        self.post = Post.objects.create(title='Test Post', author_name='test author', author_id=self.user, body='test body')
        # create a comment
        self.comment = Comment.objects.create(author=self.user, comment='test comment', post=self.post)

    def test_like_post(self):
        # create a like for the post
        like = Likes.objects.create(summary='like post', author=self.user, post=self.post)
        # check if the like is created
        self.assertEqual(Likes.objects.count(), 1)

    def test_like_comment(self):
        # create a like for the comment
        like = Likes.objects.create(summary='like comment', author=self.user, post=self.post, comment=self.comment)
        # check if the like is created
        self.assertEqual(Likes.objects.count(), 1)
