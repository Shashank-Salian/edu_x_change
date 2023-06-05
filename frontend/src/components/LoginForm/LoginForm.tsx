import { useState } from "preact/hooks";
import ExcWritten from "@/assets/logos/ExcWritten";

import classes from "./LoginForm.module.css";
import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";

import {
	getCookie,
	isValidEmail,
	isValidUsername,
	request,
} from "@/utils/utils";
import { TargetedEvent } from "preact/compat";

type Props = {};

const LoginForm = (_props: Props) => {
	const [isSignupForm, setIsSignupForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [signupData, setSignupData] = useState([
		{
			id: "signupName",
			type: "text",
			isValid: () => signupData[0].value.length >= 2,
			value: "",
			placeholder: "Name",
		},
		{
			id: "signupEmail",
			type: "email",
			isValid: () => isValidEmail(signupData[1].value),
			value: "",
			placeholder: "Email",
		},
		{
			id: "signupUsername",
			type: "text",
			isValid: () => isValidUsername(signupData[2].value),
			value: "",
			placeholder: "Username",
		},
		{
			id: "signupPassword",
			type: "password",
			isValid: () => signupData[3].value.length >= 8,
			value: "",
			placeholder: "Password",
		},
		{
			id: "signupConfirmPassword",
			type: "password",
			isValid: () => signupData[4].value === signupData[3].value,
			value: "",
			placeholder: "Confirm password",
		},
	]);

	const [signinData, setSigninData] = useState([
		{
			id: "loginUsername",
			type: "text",
			isValid: () =>
				isValidEmail(signinData[0].value) ||
				isValidUsername(signinData[0].value),
			value: "",
			placeholder: "Username or Email",
		},
		{
			id: "loginPassword",
			type: "password",
			isValid: () => signinData[1].value.length >= 8,
			value: "",
			placeholder: "Password",
		},
	]);

	const [messageData, setMessageData] = useState<{
		message: string;
		type: "normal" | "success" | "error";
	}>({
		message: "",
		type: "normal",
	});

	const onSignupInput = (
		e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement>,
		i: number
	) => {
		console.log(i);
		setSignupData((oldData) => {
			const newData = [...oldData];

			newData[i].value = e.currentTarget.value;
			return newData;
		});
	};

	const onSignInInput = (
		e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement>,
		i: number
	) => {
		setSigninData((oldData) => {
			const newData = [...oldData];
			newData[i].value = e.currentTarget.value;
			return newData;
		});
	};

	/**
	 * Creates the user and logs the user in with credentials given.
	 * This function handles all the errors and sets the session cookies too.
	 */
	const signUp = async (
		fullName: string,
		email: string,
		userName: string,
		password: string
	) => {
		console.log(fullName, email, userName, password);

		const formData = new FormData();
		formData.append("fullName", fullName);
		formData.append("email", email);
		formData.append("userName", userName);
		formData.append("password", password);

		try {
			const rawRes = await request("/api/users/signup/", formData, "POST");
			const res = await rawRes.json();

			console.log(res);
			if (res.ok) {
				setMessageData({
					message: res.message,
					type: "success",
				});
				return;
			}

			setMessageData({
				message: res.message,
				type: "error",
			});
		} catch (error) {
			setMessageData({
				message: "Something went wrong",
				type: "error",
			});
			console.log(error);
		}
	};

	/**
	 * Signs the user in with username and password.
	 * This function handles all the errors and sets the session cookies too.
	 */
	const signIn = async (username: string, password: string) => {
		try {
			const formData = new FormData();
			formData.append("userName", username);
			formData.append("password", password);

			const rawRes = await request("/api/users/login/", formData, "POST");
			const res = await rawRes.json();

			console.log(res);

			if (res.ok) {
				setMessageData({
					message: res.message,
					type: "success",
				});
				return;
			}
			setMessageData({
				message: res.message,
				type: "error",
			});
		} catch (err) {
			setMessageData({
				message: "Something went wrong",
				type: "error",
			});
			console.log(err);
		}
	};

	const onSubmit = async (e: TargetedEvent<HTMLFormElement, Event>) => {
		e.preventDefault();
		e.stopImmediatePropagation();

		if (isSignupForm) {
			if (signupData.every((ele) => ele.isValid())) {
				setIsLoading(true);
				await signUp(
					signupData[0].value,
					signupData[1].value,
					signupData[2].value,
					signupData[3].value
				).catch(() => {});
				setIsLoading(false);
				return;
			}
		}

		if (signinData.every((ele) => ele.isValid())) {
			setIsLoading(true);
			await signIn(signinData[0].value, signinData[1].value).catch(() => {});
			setIsLoading(false);
			return;
		}

		setMessageData({
			message: "Entered data is not valid",
			type: "error",
		});
	};

	const onSwitchFormClick = () => {
		setMessageData({ message: "", type: "normal" });
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
				<div className={`mt-40`}>
					{isSignupForm ? (
						signupData.map((eleData, i) => (
							<Input
								key={i}
								id={eleData.id}
								type={eleData.type}
								placeholder={eleData.placeholder}
								name={`form-${eleData.id}`}
								required
								value={eleData.value}
								onInput={(e) => onSignupInput(e, i)}
								isValid={eleData.isValid()}
								className='mt-30 fw'
								whiteLbl
							/>
						))
					) : (
						<>
							{signinData.map((eleData, i) => (
								<Input
									key={i}
									id={eleData.id}
									name={`form-${eleData.id}`}
									type={eleData.type}
									placeholder={eleData.placeholder}
									value={eleData.value}
									required
									onInput={(e) => onSignInInput(e, i)}
									isValid={eleData.isValid()}
									className='mt-30 fw'
									whiteLbl
								/>
							))}
							<Button className={`mt-10`} color='transp' type='button'>
								Forgot password ?
							</Button>
						</>
					)}
				</div>
				<p
					className={`mt-20 mb-20 ${classes.msgField}`}
					data-type={messageData.type}
				>
					{messageData.message}
				</p>
				<Button
					className={`mb-30 ${classes.submitBtn}`}
					size='large'
					color='orange'
					type='submit'
					loading={isLoading}
				>
					{isSignupForm ? "Sign up" : "Log in"}
				</Button>
				<div className={classes.switchContainer}>
					{isSignupForm ? "Already have an account ?" : "New here ?"}
					<Button
						className={`${classes.switchBtn}`}
						color='transp'
						type='button'
						onClick={onSwitchFormClick}
					>
						{isSignupForm ? "Log In" : "Sign Up"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
