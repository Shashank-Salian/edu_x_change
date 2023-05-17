from django.db import models
from users.models import Users

from basic.exceptions import AlreadyExistException, ValidationException


# Create your models here.
class Community(models.Model):
	name = models.CharField(max_length=25)
	created_time = models.DateTimeField(auto_now_add=True)
	participants = models.ManyToManyField(
	    Users,
	    related_name='communities_joined',
	)
	topic = models.CharField(max_length=25, default=None)
	description = models.CharField(max_length=500, default=None)
	icon_path = models.ImageField(upload_to='userassets/community_icons/',
	                              default=None,
	                              null=True)

	admin = models.ForeignKey("users.Users",
	                          related_name='admin_of',
	                          null=True,
	                          on_delete=models.SET_NULL)

	# posts: models.ForeignKey[models.Model] = models.ForeignKey(
	#     "posts.Posts", on_delete=models.SET_NULL)

	def save(self, *args, **kwargs):
		if self.name is None or len(self.name) < 3 or len(
		    self.name) > 25 or self.topic is None or len(
		        self.topic) < 3 or len(self.topic) > 25 or len(
		            self.description) > 500:
			raise ValidationException("Some field entered were invalid!",
			                          "INVALID_FIELD")
		if self.community_exists(self.name):
			raise AlreadyExistException(
			    f"Community with name {self.name} already exists",
			    "COMMUNITY_NAME_TAKEN")
		super().save(*args, **kwargs)

	def community_exists(self, name):
		try:
			Community.objects.get(name=name)
			return True
		except Community.DoesNotExist:
			return False

	def __str__(self) -> str:
		return self.name
