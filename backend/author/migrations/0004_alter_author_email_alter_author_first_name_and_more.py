# Generated by Django 4.1.6 on 2023-02-25 01:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("author", "0003_alter_author_managers_alter_author_date_joined"),
    ]

    operations = [
        migrations.AlterField(
            model_name="author",
            name="email",
            field=models.EmailField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name="author",
            name="first_name",
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name="author",
            name="last_name",
            field=models.CharField(max_length=200),
        ),
    ]