from django.db import models
from django.core.exceptions import ValidationError
from basic.utils import *
from basic.exceptions import AlreadyExistException

# from posts.models import Posts
# from community.models import Community


# Create your models here.
class Users(models.Model):
	name = models.CharField(max_length=35)
	username = models.CharField(max_length=20, unique=True)
	password = models.CharField(max_length=100)
	email = models.EmailField(max_length=50)
	created_time = models.DateTimeField(auto_now_add=True)

	# session = models.CharField()

	def save(self, *args, **kwargs):
		if is_valid_name(self.name) and is_valid_email(
		    self.email) and is_valid_password(
		        self.password) and is_valid_username(self.username):
			if self.user_exists(self.username):
				raise AlreadyExistException(
				    f"User with '{self.username}' username already exist",
				    "USERNAME_TAKEN")
			super().save(*args, **kwargs)
			return
		raise ValidationError("Some fields submitted were invalid!",
		                      "INVALID_FIELD")

	def user_exists(self, username):
		try:
			Users.objects.get(username=username)
			return True
		except Users.DoesNotExist:
			return False

	def __str__(self) -> str:
		return self.username


# class UserSettings(models.Model):
# 	pass