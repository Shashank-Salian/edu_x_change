import { JSX } from "preact";
import { useState } from "preact/hooks";
import ExcWritten from "@/assets/logos/ExcWritten";

import classes from "./LoginForm.module.css";
import Input from "../UI/Input/Input";

import { getCookie, isValidEmail, isValidUsername } from "@/utils/utils";
import { TargetedEvent } from "preact/compat";

type Props = {
	children?: JSX.Element | JSX.Element[];
};

const LoginForm = (props: Props) => {
	const [isSignupForm, setIsSignupForm] = useState(false);
	const [signupData, setSignupData] = useState({
		fullName: {
			valid: false,
			value: "",
			id: "signupName",
		},
		email: {
			valid: false,
			value: "",
			id: "signupEmail",
		},
		username: {
			valid: false,
			value: "",
			id: "signupUsername",
		},
		password: {
			valid: false,
			value: "",
			id: "signupPassword",
		},
		confirmPassword: {
			valid: false,
			value: "",
			id: "signupConfirmPassword",
		},
	});
	const [signinData, setSigninData] = useState({
		username: {
			valid: false,
			value: "",
			id: "loginUsername",
		},
		password: {
			valid: false,
			value: "",
			id: "loginPassword",
		},
	});

	const onSignupInput = (e: InputEvent, id: string) => {
		const newState = {
			...signupData,
		};
		switch (id) {
			case signupData.fullName.id:
				newState.fullName.value += e.data;
				break;
			case signupData.email.id:
				newState.email.value += e.data;
				break;
			case signupData.username.id:
				newState.username.value += e.data;
				break;
			case signupData.password.id:
				newState.password.value += e.data;
				break;
			case signupData.confirmPassword.id:
				newState.confirmPassword.value += e.data;
				break;
		}
		setSignupData(newState);
	};

	const onSignInInput = (e: InputEvent, id: string) => {
		const newState = {
			...signinData,
		};
		switch (id) {
			case signinData.username.id:
				newState.username.value += e.data;
				break;
			case signinData.password.id:
				newState.password.value += e.data;
				break;
		}
		setSigninData(newState);
	};

	async function signup(
		fullName: string,
		email: string,
		userName: string,
		password: string
	) {
		console.log(fullName, email, userName, password);
		const data: any = {
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
					"X-CSRFToken": getCookie("csrftoken")!,
				},
			});

			const res = await rawRes.json();
			console.log(res);
			// if (res.error) signupMsgField.setAttribute("data-type", "error");
			// else if (res.ok) signupMsgField.setAttribute("data-type", "success");
			// signupMsgField.textContent = res.message;
		} catch (error) {
			console.log(error);
		}
	}

	const onSubmit = (e: TargetedEvent<HTMLFormElement, Event>) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (
			isSignupForm &&
			signupData.fullName.value.length >= 2 &&
			isValidEmail(signupData.email.value) &&
			isValidUsername(signupData.username.value) &&
			signupData.password.value.length >= 8 &&
			signupData.confirmPassword.value === signupData.password.value
		) {
			signup(
				signupData.fullName.value,
				signupData.email.value,
				signupData.username.value,
				signupData.password.value
			);
		}
	};

	const onSwitchFormClick = () => {
		setIsSignupForm((oldState) => !oldState);
	};

	return (
		<div className={`drop-shadow ${classes.container}`}>
			<div className={classes.heading}>
				<p className={classes.loginText}>
					{isSignupForm ? "Sign up to" : "Log in to"}
				</p>
				<ExcWritten width='120' color='var(--white)' />
			</div>
			<form
				action={`/api/users/${isSignupForm ? "signup" : "login"}`}
				method={"POST"}
				onSubmit={onSubmit}
			>
				<div className={classes.inputContainer}>
					{isSignupForm ? (
						<>
							<Input
								id={signupData.fullName.id}
								placeholder='Name'
								name='name'
								required
								value={signupData.fullName.value}
								onInput={(e: InputEvent) =>
									onSignupInput(e, signupData.fullName.id)
								}
							/>
							<Input
								type='email'
								id={signupData.email.id}
								placeholder='Email'
								required
								name='email'
								value={signupData.email.value}
								onInput={(e: InputEvent) =>
									onSignupInput(e, signupData.email.id)
								}
							/>
							<Input
								id={signupData.username.id}
								placeholder='Username'
								name='signup-username'
								required
								value={signupData.username.value}
								onInput={(e: InputEvent) =>
									onSignupInput(e, signupData.username.id)
								}
							/>
							<Input
								id={signupData.password.id}
								type='password'
								placeholder='Password'
								name='signup-password'
								required
								value={signupData.password.value}
								onInput={(e: InputEvent) =>
									onSignupInput(e, signupData.password.id)
								}
							/>
							<Input
								id={signupData.confirmPassword.id}
								type='password'
								placeholder='Confirm Password'
								name='confirm-password'
								required
								value={signupData.confirmPassword.value}
								onInput={(e: InputEvent) =>
									onSignupInput(e, signupData.confirmPassword.id)
								}
							/>
						</>
					) : (
						<>
							<Input
								id={signinData.username.id}
								placeholder='Username or Email'
								required
								value={signinData.username.value}
								onInput={(e: InputEvent) =>
									onSignInInput(e, signinData.username.id)
								}
							/>
							<Input
								id={signinData.password.id}
								placeholder='Password'
								type='password'
								required
								value={signinData.password.value}
								onInput={(e: InputEvent) =>
									onSignInInput(e, signinData.password.id)
								}
							/>
							<button
								className={`btn transp ${classes.forgotPassBtn}`}
								type='button'
							>
								Forgot password ?
							</button>
						</>
					)}
				</div>
				<p className={classes.msgField} data-type='normal'></p>
				<button
					className={`btn orange large ${classes.submitBtn}`}
					type='submit'
				>
					{isSignupForm ? "Sign up" : "Log in"}
				</button>
				<div className={classes.switchContainer}>
					{isSignupForm ? "Already have an account ?" : "New here ?"}
					<button
						className={`btn transp ${classes.switchBtn}`}
						type='button'
						onClick={onSwitchFormClick}
					>
						{isSignupForm ? "Log In" : "Sign Up"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
