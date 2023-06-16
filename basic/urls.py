from django.urls import path, include
from . import views

urlpatterns = [
    # Pages Routes
    path('', views.home),
    path('login/', views.login, name="login"),
    path('post/', views.post, name="post"),

    # API Routes
    path('api/users/', include('users.urls')),
    path('api/community/', include('community.urls')),
    path('api/posts/', include('posts.urls')),

    # Community pages
    path('x/', include('community.urls')),

    # Favicon
    path('favicon.ico', views.favicon),

    # 404
    path('404/', views.not_found),
]
