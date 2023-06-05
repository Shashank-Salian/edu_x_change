function request(path: string, body?: any, method = "GET") {
	return fetch(path, {
		method,
		headers: new Headers({
			"X-CSRFToken": getCookie("csrftoken") || "",
		}),
		body,
	});
}

function isValidUsername(username: string) {
	return /^[a-z0-9_]{3,20}$/.test(username);
}

function isValidEmail(email: string) {
	return /^[a-z0-9+_-]+@[a-z0-9]+\.{1}[a-z0-9]{2,10}$/.test(email);
}

function getCookie(cName: string) {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		const parts = cookie.split("=");
		const cookieName = parts[0];
		const cookieValue = parts[1];
		if (cookieName === cName) {
			return cookieValue;
		}
	}
	return null;
}

export { request, isValidEmail, isValidUsername, getCookie };
