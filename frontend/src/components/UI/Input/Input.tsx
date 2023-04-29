import { ComponentChild, JSX } from "preact";

import classes from "./Input.module.css";

type Props = {
	value: string;
	type?: string;
	placeholder?: string;
	className?: string;
	id?: string;
	required?: boolean;
	name?: string;
	whiteLbl?: boolean;
	onInput?: JSX.GenericEventHandler<HTMLInputElement>;
	borderClr?: string;
	noLbl?: boolean;
	resize?: "horizontal" | "vertical" | "none" | "both";
};

const Input = (props: Props) => {
	return (
		<div className={`${classes.container} ${props.className || ""}`}>
			{props.type !== "textarea" ? (
				<input
					value={props.value}
					type={props.type || "text"}
					placeholder={props.placeholder}
					required={props.required}
					name={props.name}
					className={`lite-shadow ${classes.input}`}
					onInput={props.onInput}
				/>
			) : (
				<textarea
					className={`lite-shadow ${classes.input}`}
					data-resize={props.resize}
				>
					{props.value}
				</textarea>
			)}
			{props.noLbl ? null : (
				<label
					htmlFor={props.id}
					className={`${classes.lbl} ${
						props.value !== "" ? classes.levitate : ""
					} ${props.whiteLbl ? classes.white : ""} ${
						props.type === "textarea" ? classes.txtAreaLbl : ""
					}`}
				>
					{props.placeholder}
				</label>
			)}
		</div>
	);
};

export default Input;
