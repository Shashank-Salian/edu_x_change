from django.db import models
from users.models import Users


# Create your models here.
class Community(models.Model):
	name = models.CharField(max_length=25)
	created_time = models.DateTimeField(auto_now_add=True)
	participants = models.ManyToManyField(
	    Users,
	    related_name='communities_joined',
	)

	admin = models.ForeignKey("users.Users",
	                          related_name='admin_of',
	                          null=True,
	                          on_delete=models.SET_NULL)

	# posts: models.ForeignKey[models.Model] = models.ForeignKey(
	#     "posts.Posts", on_delete=models.SET_NULL)

	def __str__(self) -> str:
		return self.name
