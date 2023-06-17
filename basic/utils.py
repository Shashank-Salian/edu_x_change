import re

from PIL import Image, UnidentifiedImageError

from django.template import loader
from minify_html_onepass import minify

import logging

logger = logging.getLogger(__name__)


def get_logger(name):
	return logging.getLogger(name)


def get_user_data(user):
	return {
	    'id': user.id,
	    'name': user.name,
	    'username': user.username,
	    'createdDate': format_date(user.created_time),
	    'email': user.email,
	    'is_active': user.is_active,
	    'is_staff': user.is_staff,
	    'is_superuser': user.is_superuser,
	}


def get_post_data(post, user):
	return {
	    'id': post.id,
	    'title': post.title,
	    'body': post.body,
	    'community': post.community.name,
	    'createdUser': post.created_user.username,
	    'upvoteCount': post.upvotes_users.count(),
	    'downvoteCount': post.downvotes_users.count(),
	    'createdDate': format_date(post.created_time),
	    'upvoted': post.upvotes_users.filter(username=user.username).exists(),
	    'downvoted':
	    post.downvotes_users.filter(username=user.username).exists(),
	}


def render_and_minify(template, data={}):
	html = loader.render_to_string(template, data)
	return minify(html, minify_css=True, minify_js=True)


def is_valid_email(email):
	if email is None:
		return False
	pattern = r'^[a-z0-9+_-]+@[a-z0-9]+\.{1}[a-z0-9]{2,10}$'
	return re.match(pattern, email) is not None


def is_valid_username(username):
	if username is None:
		return False
	pattern = r'^[a-z0-9_]{3,20}$'
	return re.match(pattern, username) is not None


def is_valid_name(name):
	if name is None:
		return False
	return len(name) >= 2


def is_valid_password(password):
	if password is None:
		return False
	return len(password) >= 8


def is_valid_comm_name(name):
	if name is None:
		return False
	pattern = r"^\S{3,25}$"
	return re.match(pattern, name) is not None


def is_valid_post_title(title):
	if title is None:
		return False
	pattern = r"^(?=.*\S)[\s\S]{3,101}$"
	return re.match(pattern, title) is not None


def is_valid_post_body(body):
	if body is None:
		return False
	pattern = r"^(?=.*\S)[\s\S]{3,12000}$"
	return re.match(pattern, body) is not None


def is_valid_image(img, no_size=False):
	if img is None:
		return False
	if not no_size and img.size > (1024 * 1024):
		return False

	try:
		fmt = Image.open(img.file).format
		if fmt in ["PNG", "JPEG", "JPG", "WEBP"]:
			logger.debug("Valid Image")
			return True
	except Exception as e:
		logger.error(e)
	return False


def error_resp_data(err: Exception):
	resp = {
	    "error": True,
	    "ok": False,
	    "message": err.message,
	    "code": err.code,
	    "errorName": err.error_name
	}

	return resp


def success_resp_data(message: str, code="OK", data=None):
	resp = {
	    "error": False,
	    "ok": True,
	    "message": message,
	    "code": code,
	    "errorName": None
	}

	if data is not None:
		resp["data"] = data

	return resp


def format_date(dt):
	return dt.strftime("%d-%m-%Y")


def format_time(dt):
	return dt.strftime("%H:%M")


def format_com_icon_url(name):
	return f"/api/community/icon/{name}"


def format_post_imgs(name):
	return f"/api/posts/image/{name}"