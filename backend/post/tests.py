from django.test import TestCase
from .models import Post, Comment, Like
from author.models import Author

class TestCase(TestCase):

    author_data = {
        'username': 'testuser',
        'password': 'testpassword',
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'testuser@example.com',
        'githubId': 'testuser123'
    }

    post_data = {
        "title": "Test Post",
        "author_name": "testauthor",
        "description": "Test post description",
        "body": "Test post body",
        "author_id": 1,
    }

    comment_data = {
        "author": 1,
        "comment": "Test comment",
        "post": 1,
    }

    like_data = {
        "summary": "Test Like",
        "author": 1,
        "post": 1,
        "comment": 1,
    } 

    def test_post_model_create(self):
        '''
        Test for post creation
        '''
        author = Author.objects.createAuthor(**self.author_data)
        author.save()
        self.post_data["author_id"] = author
        post = Post.objects.create(**self.post_data)
        self.assertEqual(post.title, self.post_data['title'])
        self.assertEqual(post.author_name, self.post_data['author_name'])
        self.assertEqual(post.description, self.post_data['description'])
        self.assertEqual(post.body, self.post_data['body'])
        self.assertEqual(post.author_id, self.post_data['author_id'])

    def test_comment_model_create(self):
        '''
        Test for comment creation
        '''
        author = Author.objects.createAuthor(**self.author_data)
        author.save()
        self.post_data["author_id"] = author
        post = Post.objects.create(**self.post_data)
        self.comment_data["post"] = post
        self.comment_data["author"] = author
        comment = Comment.objects.create(**self.comment_data)
        self.assertEqual(comment.author, self.comment_data['author'])
        self.assertEqual(comment.comment, self.comment_data['comment'])
        self.assertEqual(comment.post, self.comment_data['post'])

    def test_like_model_create(self):
        '''
        Test for like creation
        '''
        author = Author.objects.createAuthor(**self.author_data)
        author.save()
        self.post_data["author_id"] = author
        post = Post.objects.create(**self.post_data)
        self.comment_data["post"] = post
        self.comment_data["author"] = author
        comment = Comment.objects.create(**self.comment_data)
        self.like_data["post"] = post
        self.like_data["author"] = author
        self.like_data["comment"] = comment
        like = Like.objects.create(**self.like_data)
        self.assertEqual(like.author, self.like_data['author'])
        self.assertEqual(like.summary, self.like_data['summary'])
        self.assertEqual(like.post, self.like_data['post'])
        self.assertEqual(like.comment, self.like_data['comment'])

    def test_comment_model_update(self):
        '''
        Test for comment update
        '''
        author = Author.objects.createAuthor(**self.author_data)
        author.save()
        self.post_data["author_id"] = author
        post = Post.objects.create(**self.post_data)
        self.comment_data["post"] = post
        self.comment_data["author"] = author
        comment = Comment.objects.create(**self.comment_data)
        comment.comment = "Updated Comment"
        comment.save()
        self.assertEqual(comment.comment, "Updated Comment")

    def test_comment_model_delete(self):
        '''
        Test for comment deletion
        '''
        author = Author.objects.createAuthor(**self.author_data)
        author.save()
        self.post_data["author_id"] = author
        post = Post.objects.create(**self.post_data)
        self.comment_data["post"] = post
        self.comment_data["author"] = author
        comment = Comment.objects.create(**self.comment_data)
        comment.delete()
        self.assertEqual(Comment.objects.all().count(), 0)

    def test_like_model_delete(self):
        '''
        Test for like deletion
        '''
        author = Author.objects.createAuthor(**self.author_data)
        author.save()
        self.post_data["author_id"] = author
        post = Post.objects.create(**self.post_data)
        self.comment_data["post"] = post
        self.comment_data["author"] = author
        comment = Comment.objects.create(**self.comment_data)
        self.like_data["post"] = post
        self.like_data["author"] = author
        self.like_data["comment"] = comment
        like = Like.objects.create(**self.like_data)
        like.delete()
        self.assertEqual(Like.objects.all().count(), 0)
