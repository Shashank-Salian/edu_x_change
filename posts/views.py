from django.http import HttpResponse, HttpRequest, JsonResponse
from django.views import View
from django.shortcuts import redirect

import time

from basic.exceptions import *
from basic.utils import *
from community.models import Community
from .models import Posts, PostsImagesStore
from users.models import Users


def create_post_and_respond(user,
                            title=None,
                            community=None,
                            body=None,
                            is_drafted=True):
	"""
	Create a new post and responds with a JSON object.
	The user parameter is required, and represents the user creating the post. 

	Returns a JSON response object.
	"""
	try:
		p = Posts(title=title,
		          community=community,
		          body=body,
		          is_drafted=True,
		          created_user=user)
		p.validate_post()
		p.save()
		key = "drafted" if is_drafted else "saved"
		resp = success_resp_data(f"Post {key} successfully")
		return JsonResponse(resp)
	except ValidationException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=406)
	resp = error_resp_data(ServerException(), status=500)
	return JsonResponse(resp, status=500)


def save(req: HttpRequest):
	if not req.user.is_active or not req.user.has_perm('posts.add_posts'):
		resp = error_resp_data(
		    NotAuthorizedException("Not authorized to create a post"))
		return JsonResponse(resp, status=401)

	title = req.POST.get('title')
	body = req.POST.get('body')
	comm_name = req.POST.get('community')

	community = None

	# Check if user is in the community
	try:
		community = Community.objects.get(name=comm_name)
		if not community.user_exists(req.user.username):
			resp = error_resp_data(
			    DoesNotExistException(
			        "You dont belong to this community, join the community to post"
			    ))
			return JsonResponse(resp, status=401)
	except Community.DoesNotExist:
		resp = error_resp_data(
		    DoesNotExistException("Community does not exist"))
		return JsonResponse(resp, status=400)

	# Create the post
	try:
		drafted = Posts.objects.get(created_user=req.user, is_drafted=True)
		drafted.title = title
		drafted.body = body
		drafted.community = community
		drafted.is_drafted = False

		drafted.validate_post()
		drafted.save()
		resp = success_resp_data("Post created successfully")
		return JsonResponse(resp)
	except Posts.DoesNotExist:
		return create_post_and_respond(req.user,
		                               title=title,
		                               body=body,
		                               community=community,
		                               is_drafted=False)
	except ValidationException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=406)
	except Exception as e:
		logger.error(e)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)

	resp = error_resp_data(ServerException())
	return JsonResponse(resp, status=500)


class Draft(View):

	def get(self, req: HttpRequest):
		if not req.user.is_active:
			return JsonResponse(
			    error_resp_data(NotAuthorizedException("Not authorized")))

		try:
			posts = Posts.objects.get(created_user=req.user, is_drafted=True)
			posts_info = {
			    'id': posts.id,
			    'title': posts.title,
			    'body': posts.body,
			    'createdDate': format_date(posts.created_time),
			    'createdTime': format_time(posts.created_time),
			    'communityName':
			    posts.community.name if posts.community else None
			}
			resp = success_resp_data("Successfully retrieved", data=posts_info)
			return JsonResponse(resp, status=200)
		except Posts.DoesNotExist as e:
			resp = error_resp_data(
			    DoesNotExistException("No drafted post, create new post",
			                          "NO_DRAFTED_POST"))
			return JsonResponse(resp, status=204)
		except Exception as e:
			logger.error(e)
			resp = error_resp_data(ServerException())
			return JsonResponse(resp, status=500)

	def post(self, req: HttpRequest):
		if not req.user.is_active or not req.user.has_perm('posts.add_posts'):
			resp = error_resp_data(
			    NotAuthorizedException("Not authorized to create a post"))
			return JsonResponse(resp, status=401)

		title = req.POST.get('title')
		comm_name = req.POST.get('community')
		body = req.POST.get('body')

		print(title, comm_name, body)

		community = None

		if comm_name:
			try:
				community = Community.objects.get(name=comm_name)
				if not community.user_exists(req.user.username):
					resp = error_resp_data(
					    DoesNotExistException(
					        "You dont belong to this community, join the community to post"
					    ))
					return JsonResponse(resp, status=401)
			except Community.DoesNotExist:
				resp = error_resp_data(
				    DoesNotExistException("Community does not exist"))
				return JsonResponse(resp, status=404)

		try:
			dp = Posts.objects.get(created_user=req.user, is_drafted=True)

			if title is not None:
				dp.title = title
			if community is not None:
				dp.community = community
			if body is not None:
				dp.body = body
			dp.validate_post()
			dp.save()
			resp = success_resp_data("Post drafted successfully")
			return JsonResponse(resp, status=200)
		except Posts.DoesNotExist:
			return create_post_and_respond(user=req.user,
			                               title=title,
			                               community=community,
			                               body=body,
			                               is_drafted=True)
		except ValidationException as e:
			resp = error_resp_data(e)
			return JsonResponse(resp, status=406)
		except Exception as e:
			logger.error(e)
			resp = error_resp_data(ServerException())
			return JsonResponse(resp, status=500)

		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)


class ImageView(View):

	def get(self, req: HttpRequest, img_name: str):
		if not req.user.is_active:
			resp = error_resp_data(NotAuthorizedException("Not authorized"))
			return JsonResponse(resp, status=401)

		try:
			img = PostsImagesStore.objects.get(image_name=img_name)
			resp = HttpResponse(img.image, content_type="image/png")
			return resp
		except PostsImagesStore.DoesNotExist as e:
			resp = redirect('/static/image_error.svg', status=404)
			return resp
		except Exception as e:
			logger.error(e)
			resp = error_resp_data(ServerException())
			return JsonResponse(resp, status=500)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)

	def post(self, req: HttpRequest):
		if not req.user.is_active:
			resp = error_resp_data(NotAuthorizedException("Not authorized"))
			return JsonResponse(resp, status=401)

		img = req.FILES.get('image')

		if not is_valid_image(img, True):
			resp = error_resp_data(
			    ValidationException(
			        "Invalid image, only JPG, PNG, webp formats are allowed",
			        "INVALID_IMAGE"))
			return JsonResponse(resp, status=406)

		try:
			drafted_post = Posts.objects.get(created_user=req.user,
			                                 is_drafted=True)
			img_name = f"{time.time()}_{drafted_post.id}_{img.name}"

			img_db = PostsImagesStore(image=img, image_name=img_name)
			img_db.save()

			drafted_post.images.add(img_db)
			drafted_post.save()
			resp = success_resp_data("Image added successfully",
			                         data=format_post_imgs(img_db.image_name))
			return JsonResponse(resp)
		except Posts.DoesNotExist:
			resp = error_resp_data(
			    DoesNotExistException(
			        "Post does not exist, wait till it is drafted"))
			return JsonResponse(resp, status=400)
		except Exception as e:
			logger.error(e)
			resp = error_resp_data(ServerException())
			return JsonResponse(resp, status=500)
