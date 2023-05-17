import re

import mimetypes


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


"""
Create a dictionary of response data based on the provided message, status, error, and code.

:param message: string containing the message to be included in the response
:param ok: boolean indicating if the response is successful or not, defaults to True
:param error: boolean indicating if the response contains an error, defaults to False
:param code: string containing the status code of the response, defaults to "OK"
:return: a dictionary containing the response data
"""


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
