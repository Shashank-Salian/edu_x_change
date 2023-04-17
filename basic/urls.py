from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('favicon.ico', views.favicon),
    path('signin/', views.signin, name="signin")
]
