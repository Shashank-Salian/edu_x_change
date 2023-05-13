import re


def is_valid_email(email):
	pattern = r'^[a-z0-9+_-]+@[a-z0-9]+\.{1}[a-z0-9]{2,10}$'
	return re.match(pattern, email) is not None


def is_valid_username(username):
	pattern = r'^[a-z0-9_]{3,20}$'
	return re.match(pattern, username) is not None


def is_valid_name(name):
	return len(name) >= 2


def is_valid_password(password):
	return len(password) >= 8


"""
Create a dictionary of response data based on the provided message, status, error, and code.

:param message: string containing the message to be included in the response
:param ok: boolean indicating if the response is successful or not, defaults to True
:param error: boolean indicating if the response contains an error, defaults to False
:param code: string containing the status code of the response, defaults to "OK"
:return: a dictionary containing the response data
"""


def create_response_data(message: str, ok=True, error=False, code="OK"):
	if error:
		ok, code = False, "UNKNOWN" if code == "OK" else code
	if not ok:
		error, code = True, "UNKNOWN" if code == "OK" else code

	resp = {"error": error, "ok": ok, "message": message, "code": code}

	return resp
