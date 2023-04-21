class UserAlreadyExistException(Exception):

	def __init__(self, message: str, code: str):
		self.message = message
		self.code = code
