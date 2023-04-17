from django.db import models

# from posts.models import Posts
# from community.models import Community


# Create your models here.
class Users(models.Model):
	name = models.CharField(max_length=50)
	username = models.CharField(max_length=50)
	password = models.CharField(max_length=100)
	email = models.EmailField(max_length=50)
	created_time = models.DateTimeField(auto_now_add=True)

	# session = models.CharField()

	def __str__(self) -> str:
		return self.username


# class UserSettings(models.Model):
# 	pass