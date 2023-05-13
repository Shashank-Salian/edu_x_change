from django.db import models
from django.core.exceptions import ValidationError
from users.models import Users


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
	icon_path = models.ImageField(upload_to='community_icons/',
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
			raise ValidationError("Some field entered were invalid!",
			                      "INVALID_FIELD")
		super().save(*args, **kwargs)

	def __str__(self) -> str:
		return self.name
