from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_community, name="create_community"),
]
