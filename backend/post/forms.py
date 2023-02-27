from django.forms import ModelForm

from .models import Post


class PostModel(ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'public', 'description', 'body', 'unlisted']