import re

from PIL import Image, UnidentifiedImageError

import logging

logger = logging.getLogger(__name__)


def get_logger(name):
	return logging.getLogger(name)


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