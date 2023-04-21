/**
 *
 * @param {string} cls
 * @returns {HTMLElement}
 */
function $(cls) {
	return document.querySelector(cls);
}

/**
 *
 * @param {string} username
 * @returns {boolean}
 */
function isValidUsername(username) {
	return /^[a-z0-9_]{3,20}$/.test(username);
}

/**
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
	return /^[a-z0-9+_-]+@[a-z0-9]+\.{1}[a-z0-9]{2,10}$/.test(email);
}

/**
 *
 * @param {string} cookieName
 * @returns
 */
function getCookie(cookieName) {
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
