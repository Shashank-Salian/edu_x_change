from django.db import models
from django.db.models import Model, ForeignKey


# Create your models here.
class Posts(Model):
	heading = models.CharField(max_length=100)
	created_time = models.DateTimeField(auto_now_add=True)
	body = models.CharField(max_length=25_000)
	upvote_count = models.PositiveIntegerField(default=0)
	downvote_count = models.PositiveIntegerField(default=0)
	created_user = ForeignKey("users.Users",
	                          null=True,
	                          related_name='posts_created',
	                          on_delete=models.SET_NULL)
	upvotes_user = ForeignKey("users.Users",
	                          null=True,
	                          related_name='posts_upvoted',
	                          on_delete=models.SET_NULL)
	downvotes_user = ForeignKey("users.Users",
	                            null=True,
	                            related_name='posts_downvoted',
	                            on_delete=models.SET_NULL)

	community = ForeignKey('community.Community', on_delete=models.CASCADE)

	def __str__(self) -> str:
		return self.heading
