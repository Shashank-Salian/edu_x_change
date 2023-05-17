from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.core.exceptions import ValidationError

from .models import Users
from basic.exceptions import AlreadyExistException
from basic.utils import *

import json


# Create your views here.
def signupuser(req: HttpRequest):
	if req.method != "POST":
		resp = create_resp_data("Wrong method", error=True)
		return JsonResponse(resp, status=400)

	name = req.POST.get("fullName", None)
	email = req.POST.get("email", None)
	username = req.POST.get("userName", None)
	password = req.POST.get("password", None)

	try:
		u = Users(name=name, email=email, username=username, password=password)
		u.save()
		resp = success_resp_data("User created successfully")
		return JsonResponse(resp)
	except ValidationError as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=406)
	except AlreadyExistException as e:
		resp = error_resp_data(e)
		return JsonResponse(resp, status=409)
