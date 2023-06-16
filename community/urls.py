from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_community, name="create_community"),
    path("mycommunities/", views.my_communities, name="my_communities"),
    path("icon/<str:c_name>/", views.community_icon, name="community_icon"),
    path("posts/<str:c_name>", views.comm_posts),
    path("<str:c_name>/", views.comm_page),
]
