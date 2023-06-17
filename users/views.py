from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required

from .models import Users
from basic.exceptions import *
from basic.utils import *


# Create your views here.
def signup_user(req: HttpRequest):
	if req.method != "POST":
		resp = error_resp_data(WrongMethodException())
		return JsonResponse(resp, status=400)

	name = req.POST.get("fullName")
	email = req.POST.get("email")
	username = req.POST.get("userName")
	password = req.POST.get("password")

	print(name, email, username, password)

	try:
		u = Users.objects.create_user(username=username,
		                              password=password,
		                              name=name,
		                              email=email)

		au = authenticate(username=username, password=password)
		print(au)
		if au is not None:
			login(req, u)  # login the user
			# return redirect("/")
			resp = success_resp_data("User created and logged in successfully")
			return JsonResponse(resp)
		resp = success_resp_data("Authentication error!")
		return JsonResponse(resp)
	except ValidationException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=406)
	except AlreadyExistException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=409)
	except Exception as e:
		resp = error_resp_data(ServerException())
		print(e)
		return JsonResponse(resp, status=500)


def login_user(req: HttpRequest):
	print(req.user)
	if req.method != "POST":
		resp = error_resp_data(WrongMethodException())
		return JsonResponse(resp, status=400)

	username = req.POST.get("userName", None)
	password = req.POST.get("password", None)

	try:
		u = Users.objects.get(username=username)

		print(u)

		au = authenticate(username=username, password=password)

		if au is not None:
			login(req, au)
			# redirect("/")
			resp = success_resp_data("User logged in successfully")
			return JsonResponse(resp)

		resp = error_resp_data(
		    NotAuthorizedException(
		        "Wrong credentials. Check your username or password and try again."
		    ))
		return JsonResponse(resp, status=401)
	except Users.DoesNotExist:
		resp = error_resp_data(
		    NotAuthorizedException(
		        f"User with username '{username}' does not exist"))
		return JsonResponse(resp, status=401)
	except Exception as e:
		logger.error(e)
		resp = error_resp_data(
		    ServerException("Something went wrong. Please try again later."))
		return JsonResponse(resp, status=500)


def get_user_info(req: HttpRequest):
	if not req.user.is_active:
		return JsonResponse(error_resp_data(
		    NotAuthorizedException("Login to get info")),
		                    status=401)

	u_data = get_user_data(req.user)
	resp = success_resp_data("User data retrieved successfully", data=u_data)
	return JsonResponse(resp)
