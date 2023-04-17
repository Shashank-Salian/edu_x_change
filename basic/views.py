# from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from django.template import loader
from minify_html_onepass import minify

static_page_cache = {}


def render_and_minify(template):
	html = loader.render_to_string(template)
	return minify(html, minify_css=True, minify_js=True)


def home(req: HttpRequest):
	return HttpResponse("<h1>Home Page</h1>")


def signin(req: HttpRequest):
	return HttpResponse(render_and_minify("login/index.html"))


def favicon(req: HttpRequest):
	with open('static/EXC.svg') as f:
		return HttpResponse(f.read(),
		                    content_type="image/svg+xml; charset=utf-8")
	# return HttpResponse()
