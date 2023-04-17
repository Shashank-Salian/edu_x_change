from django.urls import path
from django.http import HttpResponse, HttpRequest


def hello(req: HttpRequest):

	return HttpResponse("Welcome to Posts app")


urlpatterns = [path('create/', hello)]
