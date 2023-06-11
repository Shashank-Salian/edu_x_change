from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create),
    path('draft/', views.draft, name="draft"),
]
