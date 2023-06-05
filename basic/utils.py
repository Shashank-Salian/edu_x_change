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


def is_valid_image(img):
	if img.size > (1024 * 1024):
		return False
	try:
		fmt = Image.open(img.file).format
		if fmt in ["PNG", "JPEG", "JPG"]:
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


def success_resp_data(message: str, code="OK"):
	resp = {
	    "error": False,
	    "ok": True,
	    "message": message,
	    "code": code,
	    "errorName": None
	}

	return resp


def is_image(file):
	head = file.read(256)

	# Check if the file starts with a JPEG SOI marker.
	if head.startswith(b'\xFF\xD8'):
		return True

	# Check if the file starts with a PNG 8-bit TGA header.
	if head.startswith(b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A'):
		return True

	if head.startswith(b'\x89PNG\r\n\x1A\n'):
		return True

	# The file is not an image file.
	return False
