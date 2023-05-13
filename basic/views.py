from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from django.template import loader
from minify_html_onepass import minify
from django.middleware.csrf import get_token

static_page_cache = {}


def render_and_minify(template, data={}):
	# data = {"signuppage": True}
	html = loader.render_to_string(template, data)
	return minify(html, minify_css=True, minify_js=True)


def home(req: HttpRequest):
	res = HttpResponse(render_and_minify("home/index.html"))
	get_token(req)
	return res


def login(req: HttpRequest):
	get_token(req)
	return HttpResponse(render_and_minify("login/index.html"))


def favicon(req: HttpRequest):
	with open('static/EXC.svg') as f:
		return HttpResponse(f.read(),
		                    content_type="image/svg+xml; charset=utf-8")
	# return HttpResponse()
