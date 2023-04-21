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


def create_response_data(message: str, ok=True, error=False, code="OK"):
	if error:
		ok, code = False, "UNKNOWN" if code == "OK" else code
	if not ok:
		error, code = True, "UNKNOWN" if code == "OK" else code

	resp = {"error": error, "ok": ok, "message": message, "code": code}

	return resp
