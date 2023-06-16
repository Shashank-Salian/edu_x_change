from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.middleware.csrf import get_token
from django.contrib.auth.models import AnonymousUser

from .utils import render_and_minify

static_page_cache = {}


def home(req: HttpRequest):
	res = HttpResponse(render_and_minify("home/index.html"))
	get_token(req)
	print("home : " + str(req.user.user_permissions.all()))
	return res


def login(req: HttpRequest):
	get_token(req)
	# if req.user.is_active:
	# 	return redirect("/")
	return HttpResponse(render_and_minify("login/index.html"))


def post(req: HttpRequest):
	return HttpResponse(render_and_minify("post/index.html"))


def not_found(req: HttpRequest):
	return HttpResponse(render_and_minify("404.html"))


def favicon(req: HttpRequest):
	with open('static/EXC.svg') as f:
		return HttpResponse(f.read(),
		                    content_type="image/svg+xml; charset=utf-8")
	# return HttpResponse()
