from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create),
    path('draft/', views.Draft.as_view(), name="draft"),
    path('image/', views.ImageView.as_view(), name="image_view"),
	path('image/<str:img_name>/', views.ImageView.as_view(), name="image_get_view")
]
