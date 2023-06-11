from django.http import HttpResponse, HttpRequest, JsonResponse
from basic.exceptions import *
from basic.utils import success_resp_data, error_resp_data
from community.models import Community
from .models import Posts


def create(req: HttpRequest):
	return HttpResponse("Welcome to Posts app")


def draft(req: HttpRequest):
	if req.method != 'POST':
		return JsonResponse(error_response(WrongMethodException()), status=405)

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

		if title:
			dp.title = title
		if community:
			dp.community = community
		if body:
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
		return JsonResponse(e, status=406)
	except Exception as e:
		logger.error(e)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)

	resp = error_resp_data(ServerException())
	return JsonResponse(resp, status=500)
