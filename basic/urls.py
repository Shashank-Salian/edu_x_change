from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home),
    path('api/users/', include('users.urls')),
    path('api/community/', include('community.urls')),
    path('api/posts/', include('posts.urls')),
    path('favicon.ico', views.favicon),
    path('login/', views.login, name="login"),
]
