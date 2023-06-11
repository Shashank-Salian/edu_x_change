from django.http import HttpResponse, HttpRequest, JsonResponse
from django.views import View

import time

from basic.exceptions import *
from basic.utils import *
from community.models import Community
from .models import Posts, PostsImagesStore


def create(req: HttpRequest):
	return HttpResponse("Welcome to Posts app")


class Draft(View):

	def get(self, req: HttpRequest):
		if not req.user.is_active:
			return JsonResponse(
			    error_resp_data(NotAuthorizedException("Not authorized")))

		posts = Posts.objects.get(created_user=req.user, is_drafted=True)
		posts_info = {
		    'id': posts.id,
		    'title': posts.title,
		    'body': posts.body,
		    'createdDate': format_date(posts.created_time),
		    'createdTime': format_time(posts.created_time),
		    'communityName': posts.community.name
		}
		resp = success_resp_data("Successfully retrieved", data=posts_info)
		return JsonResponse(resp, status=200)

	def post(self, req: HttpRequest):
		if not req.user.is_active or not req.user.has_perm('posts.add_posts'):
			resp = error_response(
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
			except Community.DoesNotExist:
				resp = error_response(
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
			p = Posts(title=title,
			          community=community,
			          body=body,
			          is_drafted=True,
			          created_user=req.user)
			p.validate_post()
			p.save()
			resp = success_resp_data("Post drafted successfully")
			return JsonResponse(resp, status=200)
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
			resp = error_resp_data(
			    DoesNotExistException("Image does not exists"))
			return JsonResponse(resp, status=404)
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

		if not is_valid_image(img):
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
			return JsonResponse(resp, status=404)
		except Exception as e:
			logger.error(e)
			resp = error_resp_data(ServerException())
			return JsonResponse(resp, status=500)
