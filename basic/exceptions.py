class ServerException(Exception):

	def __init__(self, message="Something went wrong", code="UNKNOWN"):
		self.message = message
		self.code = code
		self.error_name = "SERVER_ERROR"


class AlreadyExistException(Exception):

	def __init__(self, message: str, code="UNKNOWN"):
		self.message = message
		self.code = code
		self.error_name = "ALREADY_EXIST_ERROR"


class ValidationException(Exception):

	def __init__(self, message: str, code="UNKNOWN"):
		self.message = message
		self.code = code
		self.error_name = "VALIDATION_ERROR"