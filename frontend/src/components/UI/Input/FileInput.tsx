import { JSX } from "preact";

import Upload from "@/assets/icons/Upload";
import classes from "./FileInput.module.css";
import AddPicture from "@/assets/icons/AddPicture";
import { useEffect } from "preact/hooks";

type Props = {
	className?: string;
	id?: string;
	required?: boolean;
	name?: string;
	whiteLbl?: boolean;
	onInput?: JSX.GenericEventHandler<HTMLInputElement>;
	placeholder?: string;
	accept?: string;
	image?: boolean;
	text?: string;
	preview?: string;
	width?: string;
};

const FileInput = (props: Props) => {
	useEffect(() => {
		console.log("first");
	});
	return (
		<div className={`${classes.container} ${props.className || ""}`}>
			{!props.image ? (
				<div className={`${classes.inpContainer} btn orange shadow`}>
					{props.text}
					<Upload color='#fff' className='ml-10' width='22' />
				</div>
			) : (
				<>
					<div
						className={`${classes.inpContainer} ${classes.imgInpContainer} lite-shadow`}
					>
						<AddPicture width='58' color='var(--black)' />
					</div>
					{props.preview ? (
						<img
							src={props.preview}
							className={`${classes.inpContainer} ${classes.imgInpContainer}`}
						/>
					) : null}
				</>
			)}
			<input
				type='file'
				id={props.id}
				name={props.name}
				required={props.required}
				accept={props.accept}
				onInput={props.onInput}
				style={props.width ? { width: props.width } : undefined}
				className={`${props.image ? `mb-10 ${classes.imgInp}` : classes.inp}`}
			/>
			<label htmlFor={props.id} className={`${!props.image ? "ml-20" : ""}`}>
				{props.placeholder}
			</label>
		</div>
	);
};

export default FileInput;
