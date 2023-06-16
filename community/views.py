from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Permission

import json

from basic.utils import *
from basic.exceptions import *
from .models import Community
from posts.models import Posts

logger = get_logger(__name__)


def get_comm_data(com: Community):
	data = {
	    'id': com.id,
	    'name': com.name,
	    'topic': com.topic,
	    'description': com.description,
	    'moderator': com.moderator.username,
	    'createdDate': format_date(com.created_time),
	    'iconPath': format_com_icon_url(com.name),
	    'participantsCount': com.participants.count(),
	}

	return data


# Create your views here.
def comm_page(req: HttpRequest, c_name: str):
	if not req.user.is_active:
		err = error_resp_data(
		    NotAuthorizedException("Log in to get my communities",
		                           "NO_PERMISSION"))
		return JsonResponse(err, status=403)

	logger.debug(c_name)
	start = int(req.GET.get('from', 0))
	end = req.GET.get('to', start + 10)

	try:
		com = Community.objects.get(name=c_name)
		comm_data = get_comm_data(com)

		comm_data.setdefault('userJoined', com.user_exists(req.user.username))

		return HttpResponse(
		    render_and_minify("x/index.html", {"comm_data": comm_data}))
	except Community.DoesNotExist:
		return redirect('/404/', status=404)
	except Exception as e:
		logger.error(e)
		return HttpResponse("Internal server error!", status=500)


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
		for com in comm_raw:
			communities.append(get_comm_data(com))

		logger.debug(communities)
		resp = success_resp_data("Communities retrieved successfully",
		                         data=communities)
		return JsonResponse(resp)
	except Exception as e:
		logger.error(e)
		resp = error_resp_data(ServerException())
		return JsonResponse(resp, status=500)


def comm_posts(req: HttpRequest, c_name: str):
	if not req.user.is_active:
		err = error_resp_data(
		    NotAuthorizedException("Log in to get my communities",
		                           "NO_PERMISSION"))
		return JsonResponse(err, status=403)

	try:
		com = Community.objects.get(name=c_name)

		raw_posts = Posts.objects.filter(
		    community=com, is_drafted=False).order_by('created_time')
		posts = []

		for p in raw_posts:
			posts.append({
			    'id': p.id,
			    'title': p.title,
			    'body': p.body,
			    'community': p.community.name,
			    'createdUser': p.created_user.username,
			    'upvoteCount': p.upvote_count,
			    'downvoteCount': p.downvote_count,
			    'createdDate': format_date(p.created_time),
			})

		resp = success_resp_data("Posts retrieved successfully", data=posts)
		return JsonResponse(resp)
	except Community.DoesNotExist:
		resp = error_resp_data(
		    DoesNotExistException("Community does not exists",
		                          "COMMUNITY_DOES_NOT_EXISTS"))
		return resp
	except Exception as e:
		logger.error(e)
		return HttpResponse("Internal server error!", status=500)

	pass
