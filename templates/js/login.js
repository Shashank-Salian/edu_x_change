const /**@type {HTMLInputElement} */ unameInp = $("#username-inp");
const /**@type {HTMLInputElement} */ passInp = $("#password-inp");
const headingTxt = $(".login-text");
const signupField = $(".signup-field");
const loginField = $(".login-field");
const loginMsgField = $(".message-field");

const /**@type {HTMLInputElement} */ nameInp = $("#name-inp"),
	/**@type {HTMLInputElement} */ emailInp = $("#email-inp"),
	/**@type {HTMLInputElement} */ signupUnameInp = $("#signup-username-inp"),
	/**@type {HTMLInputElement} */ signupPassInp = $("#signup-password-inp");
const signupMsgField = $(".signup-message-field");

let isLoginPage = signupField.classList.contains("hide");

/**
 * Logs the user in using username and password.
 *
 * @param {string} username
 * @param {string} password
 */
function login(username, password) {
	/**
	 * TODO: Implement sign in
	 */
	console.log(username, password);
}

/**
 * Create user account using following parameters
 * @param {string} fullName
 * @param {string} email
 * @param {string} uname
 * @param {string} password
 */
async function signup(fullName, email, userName, password) {
	console.log(fullName, email, userName, password);
	data = {
		fullName,
		email,
		userName,
		password,
	};
	try {
		const rawRes = await fetch("/api/users/signup/", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"X-CSRFToken": getCookie("csrftoken"),
			},
		});

		const res = await rawRes.json();
		console.log(res);
		if (res.error) signupMsgField.setAttribute("data-type", "error");
		else if (res.ok) signupMsgField.setAttribute("data-type", "success");
		signupMsgField.textContent = res.message;
	} catch (error) {
		console.log(error);
	}
}

function onSwitchFormClick(e) {
	if (isLoginPage) {
		signupField.classList.remove("hide");
		loginField.classList.add("hide");
		headingTxt.textContent = "Sign up to";
		isLoginPage = false;
		return;
	}
	signupField.classList.add("hide");
	loginField.classList.remove("hide");
	headingTxt.textContent = "Log in to";
	isLoginPage = true;
}

/**
 *
 * @param {MouseEvent} e
 */
function onLoginSubmit(e) {
	if (
		(isValidUsername(unameInp.value) || isValidEmail(unameInp.value)) &&
		passInp.value.length >= 8
	) {
		login(unameInp.value, passInp.value);
	}
}

/**
 *
 * @param {SubmitEvent} e
 */
function onSignupSubmit(e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	if (
		nameInp.value.length >= 2 &&
		isValidEmail(emailInp.value) &&
		isValidUsername(signupUnameInp.value) &&
		signupPassInp.value.length >= 8
	) {
		signup(
			nameInp.value,
			emailInp.value,
			signupUnameInp.value,
			signupPassInp.value
		);
	}
}

$(".login-field").addEventListener("submit", onLoginSubmit);

$(".signup-field").addEventListener("submit", onSignupSubmit);

$(".login-field .switch-signup-btn").addEventListener(
	"click",
	onSwitchFormClick
);
$(".signup-field .switch-signup-btn").addEventListener(
	"click",
	onSwitchFormClick
);
