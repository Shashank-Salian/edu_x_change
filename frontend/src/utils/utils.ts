function isValidUsername(username: string) {
	return /^[a-z0-9_]{3,20}$/.test(username);
}

function isValidEmail(email: string) {
	return /^[a-z0-9+_-]+@[a-z0-9]+\.{1}[a-z0-9]{2,10}$/.test(email);
}

function getCookie(cookieName: string) {
	const match = document.cookie.match(new RegExp(`${cookieName}=([^;]+)`));
	return match ? decodeURIComponent(match[1]) : null;
}

export { isValidEmail, isValidUsername, getCookie };
