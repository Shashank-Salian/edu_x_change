# Generated by Django 4.2 on 2023-06-23 11:49

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0005_alter_posts_downvotes_users_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='posts',
            name='saved_by',
            field=models.ManyToManyField(related_name='posts_saved', to=settings.AUTH_USER_MODEL),
        ),
    ]
