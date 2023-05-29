from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.contrib.auth.decorators import permission_required

from basic.utils import success_resp_data, error_resp_data, is_image
from basic.exceptions import *
from .models import Community


# Create your views here.
def create_community(req: HttpRequest):
	if req.method != 'POST':
		resp = create_resp_data("Wrong method", error=True)
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

	# Check if image is less than 1MB and is a valid image
	if icon_img and icon_img.size > (1024 * 1024):
		print(icon_img.size)
		if not is_image(icon_img.file):
			err = ValidationException(
			    "Icon should be a valid JPG or PNG image",
			    code="INVALID_IMAGE")
			return JsonResponse(error_resp_data(err), status=406)

		err = ValidationException("Icon size should be less than 1MB",
		                          code="SIZE_TOO_BIG")

		return JsonResponse(error_resp_data(err), status=413)

	try:
		com = Community(name=commName,
		                topic=topic,
		                description=desc,
		                icon_path=icon_img,
		                moderator=req.user)
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
		print(e)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)
