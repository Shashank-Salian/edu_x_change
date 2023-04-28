import classes from "./Input.module.css";

type Props = {
	type?: string;
	value?: string;
	placeholder?: string;
	className?: string;
	id?: string;
	required?: boolean;
	name?: string;
	blackLbl?: boolean;
	onInput?: any;
	borderClr?: string;
};

const Input = (props: Props) => {
	return (
		<div className={`${classes.container} ${props.className || ""}`}>
			<input
				value={props.value}
				type={props.type || "text"}
				placeholder={props.placeholder}
				required={props.required}
				name={props.name}
				className={`${classes.input}`}
				onInput={props.onInput}
			/>
			<label
				htmlFor={props.id}
				className={`${classes.lbl} ${
					props.value !== "" ? classes.levitate : ""
				} ${props.blackLbl ? classes.black : ""}`}
			>
				{props.placeholder}
			</label>
		</div>
	);
};

export default Input;
