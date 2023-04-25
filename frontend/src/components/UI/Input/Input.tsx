import { JSX } from "preact";
import classes from "./Input.module.css";

type Props = {
	type?: string;
	value?: string;
	placeholder?: string;
	className?: string;
	id?: string;
	required?: boolean;
	name?: string;
	onInput?: any;
};

const Input = (props: Props) => {
	return (
		<div className={classes.container}>
			<input
				value={props.value}
				type={props.type || "text"}
				placeholder={props.placeholder}
				required={props.required}
				name={props.name}
				className={`${classes.input} ${props.className || ""}`}
				onInput={props.onInput}
			/>
			<label
				htmlFor={props.id}
				className={`${classes.lbl} ${
					props.value !== "" ? classes.levitate : ""
				}`}
			>
				{props.placeholder}
			</label>
		</div>
	);
};

export default Input;
