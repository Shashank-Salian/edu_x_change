from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Permission

from basic.utils import success_resp_data, error_resp_data, is_image, get_logger
from basic.exceptions import *
from .models import Community

logger = get_logger(__name__)


# Create your views here.
def create_community(req: HttpRequest):
	if req.method != 'POST':
		resp = error_resp_data(WrongMethodException())
		return JsonResponse(resp, status=400)

	if not req.user.is_active:
		err = error_resp_data(
		    NotAuthorizedException("Log in to create community"))
		return JsonResponse(err, status=403)

	commName = req.POST.get('communityName', None)
	topic = req.POST.get('topic', None)
	desc = req.POST.get('description', None)
	icon_img = req.FILES.get('communityIcon', None)
	print(commName, topic, desc, icon_img)

	try:
		if len(
		    req.user.user_permissions.filter(codename='add_community')) == 0:
			resp = error_resp_data(
			    NotAuthorizedException(
			        "You don't have permission to create community",
			        "NO_PERMISSION"))
			return JsonResponse(resp, status=403)

		com = Community(name=commName,
		                topic=topic,
		                description=desc,
		                icon_path=icon_img,
		                moderator=req.user)
		com.validate_community()
		com.save()
		resp = success_resp_data("Community successfully created")
		return JsonResponse(resp)
	except ValidationException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=406)
	except AlreadyExistException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=409)
	except Exception as e:
		logger.error(e)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)
