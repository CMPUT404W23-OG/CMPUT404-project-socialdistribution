# Generated by Django 4.1.6 on 2023-03-03 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('author', '0012_alter_author_host_alter_author_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='host',
            field=models.URLField(default='http://localhost:8000/'),
        ),
        migrations.AlterField(
            model_name='author',
            name='url',
            field=models.URLField(default='http://localhost:8000/'),
        ),
    ]
