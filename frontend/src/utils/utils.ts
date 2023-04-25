function isValidUsername(username: string) {
	return /^[a-z0-9_]{3,20}$/.test(username);
}

function isValidEmail(email: string) {
	return /^[a-z0-9+_-]+@[a-z0-9]+\.{1}[a-z0-9]{2,10}$/.test(email);
}

function getCookie(cookieName: string) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== "") {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, cookieName.length + 1) === cookieName + "=") {
				cookieValue = decodeURIComponent(
					cookie.substring(cookieName.length + 1)
				);
				break;
			}
		}
	}
	return cookieValue;
}

export { isValidEmail, isValidUsername, getCookie };
