from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.core.exceptions import ValidationError

from .models import Users
from basic.exceptions import AlreadyExistException
from basic.utils import *

import json


# Create your views here.
def signupuser(req: HttpRequest):
	if req.method == "POST":
		jsondata = json.loads(req.body)
		name = jsondata['fullName']
		email = jsondata['email']
		username = jsondata['userName']
		password = jsondata['password']

		try:
			u = Users(name=name,
			          email=email,
			          username=username,
			          password=password)
			u.save()
			resp = create_response_data("User created successfully")
			return JsonResponse(resp)
		except ValidationError as e:
			resp = create_response_data(e.message, error=True, code=e.code)
			return JsonResponse(resp, status=406)
		except AlreadyExistException as e:
			resp = create_response_data(e.message, error=True, code=e.code)
			return JsonResponse(resp, status=409)
	resp = create_response_data("Wrong method", error=True)
	return JsonResponse(resp, status=412)
