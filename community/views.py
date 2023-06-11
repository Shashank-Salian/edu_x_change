from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Permission

from basic.utils import *
from basic.exceptions import *
from .models import Community

from zoneinfo import ZoneInfo

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
		if not req.user.has_perm('community.add_community'):
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
		com.participants.add(req.user)
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


def community_icon(req: HttpRequest, c_name: str):
	logger.debug(c_name)
	if not req.user.is_active:
		err = error_resp_data(
		    NotAuthorizedException("Log in to get icon", "NO_PERMISSION"))
		return JsonResponse(err, status=403)

	try:
		c = Community.objects.get(name=c_name)
		resp = HttpResponse(c.icon_path, content_type='image/png')
		return resp
	except Community.DoesNotExist as e:
		resp = error_resp_data(
		    DoesNotExistException(
		        f"Community with name '{c_name}' does not exists.",
		        "COMMUNITY_DOES_NOT_EXIST"))
		return HttpResponse(resp, status=404)
	except ValueError as e:
		resp = redirect("/static/community_icon.svg")
		return resp
	except Exception as e:
		logger.error(e)
		resp = redirect("/static/community_icon.svg")
		return resp


def my_communities(req: HttpRequest):
	if not req.user.is_active:
		err = error_resp_data(
		    NotAuthorizedException("Log in to get my communities",
		                           "NO_PERMISSION"))
		return JsonResponse(err, status=403)

	try:
		comm_raw = Community.objects.filter(participants=req.user)

		communities = []
		for com in comm_raw.values():
			communities.append({
			    'id': com['id'],
			    'name': com['name'],
			    'topic': com['topic'],
			    'description': com['description'],
			    'moderatorId': com['moderator_id'],
			    'createdTime': format_date(com['created_time']),
			    'iconPath': format_com_icon_url(com['name'])
			})

		logger.debug(communities)
		resp = success_resp_data("Communities retrieved successfully",
		                         data=communities)
		return JsonResponse(resp)
	except Exception as e:
		logger.error(e)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)
