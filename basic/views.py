from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.middleware.csrf import get_token
from django.contrib.auth.models import AnonymousUser

from .utils import render_and_minify, get_user_data

static_page_cache = {}


def home(req: HttpRequest):
	if not req.user.is_active:
		return redirect("/login/")
	u_data = get_user_data(req.user)
	res = HttpResponse(
	    render_and_minify("home/index.html", {'user_data': u_data}))
	get_token(req)
	print("home : " + str(req.user.user_permissions.all()))
	return res


def login(req: HttpRequest):
	get_token(req)
	# if req.user.is_active:
	# 	return redirect("/")
	return HttpResponse(render_and_minify("login/index.html"))


def post(req: HttpRequest):
	if not req.user.is_active:
		return redirect("/login/")
	u_data = get_user_data(req.user)
	return HttpResponse(
	    render_and_minify("post/index.html", {'user_data': u_data}))


def not_found(req: HttpRequest):
	if not req.user.is_active:
		return redirect("/login/")
	u_data = get_user_data(req.user)
	return HttpResponse(render_and_minify("404.html", {'user_data': u_data}))


def favicon(req: HttpRequest):
	with open('static/EXC.svg') as f:
		return HttpResponse(f.read(),
		                    content_type="image/svg+xml; charset=utf-8")
	# return HttpResponse()
