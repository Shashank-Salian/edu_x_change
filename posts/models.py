from django.db import models
from django.db.models import Model, ForeignKey
from basic.exceptions import ValidationException


# Create your models here.
class Posts(Model):
	title = models.CharField(max_length=100, null=True, default=None)
	created_time = models.DateTimeField(auto_now_add=True)
	body = models.TextField(max_length=12_000, null=True, default=None)
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

	community = ForeignKey('community.Community',
	                       on_delete=models.CASCADE,
	                       null=True,
	                       default=None)

	is_drafted = models.BooleanField(default=False)

	def validate_post(self):
		if self.created_user is None:
			raise ValidationException("You must be logged in to create a post",
			                          code="NOT_LOGGED_IN")
		if self.is_drafted:
			if (self.title is not None and
			    (len(self.title) < 3 or len(self.title) > 100)) or (
			        self.body is not None and
			        (len(self.body) < 5 or len(self.body) > 12_000)):
				raise ValidationException(
				    "Title and body must be at least 3 characters long",
				    code="INVALID_POST")
			return True
		if self.title is None or len(self.title) <= 3 or len(
		    self.title) > 100 or self.body is None or len(
		        self.body) < 5 or len(self.body) > 12_000:
			raise ValidationException(
			    "Title and body must be at least 3 characters long",
			    code="INVALID_POST")
		return True

	def __str__(self) -> str:
		return self.title
