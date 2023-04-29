import { JSX } from "preact";
import { useState } from "preact/hooks";

import Upload from "@/assets/icons/Upload";
import classes from "./FileInput.module.css";
import AddPicture from "@/assets/icons/AddPicture";

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
};

const FileInput = (props: Props) => {
	const [file, setFile] = useState<File | null>(null);

	const onFileInput: JSX.GenericEventHandler<HTMLInputElement> = (e) => {
		console.log(e.currentTarget.files);
		if (props.onInput) props.onInput(e);
		if (e.currentTarget.files && e.currentTarget.files.length !== 0) {
			const file = e.currentTarget.files[0];
			setFile(file);
		}
	};

	return (
		<div className={`${classes.container} ${props.className || ""}`}>
			{!file ? (
				<div
					className={`${classes.inpContainer} ${
						props.image
							? `lite-shadow ${classes.imgInpContainer}`
							: `btn orange shadow`
					}`}
				>
					{props.text}
					{props.image ? (
						<AddPicture width='58' color='var(--black)' />
					) : (
						<Upload color='#fff' className='ml-10' width='22' />
					)}
				</div>
			) : (
				<img
					src={URL.createObjectURL(file)}
					className={`${classes.inpContainer} ${classes.imgInpContainer}`}
				/>
			)}
			<input
				type='file'
				id={props.id}
				name={props.name}
				required={props.required}
				accept={props.accept}
				onInput={props.image ? onFileInput : props.onInput}
				className={`${props.image ? `mb-10 ${classes.imgInp}` : classes.inp}`}
			/>
			<label htmlFor={props.id} className={`${!props.image ? "ml-20" : ""}`}>
				{props.placeholder}
			</label>
		</div>
	);
};

export default FileInput;
