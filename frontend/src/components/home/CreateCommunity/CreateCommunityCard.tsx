import { JSX } from "preact";
import { useState } from "preact/hooks";

import Card from "@/components/Card/Card";
import Input from "@/components/UI/Input/Input";

import classes from "./CreateCommunityCard.module.css";
import FileInput from "@/components/UI/Input/FileInput";

type Props = {
	onCloseClick?: JSX.MouseEventHandler<HTMLDivElement>;
};

const CreateCommunityCard = (props: Props) => {
	const [inpData, setInpData] = useState("");

	const onIconInput: JSX.GenericEventHandler<HTMLInputElement> = (e) => {
		if (e.currentTarget.files && e.currentTarget.files.length !== 0) {
			const files = e.currentTarget.files;

			let data = URL.createObjectURL(files[0]);
			setInpData(data);
		}
	};

	return (
		<>
			<Card
				className={classes.container}
				heading='Create Community :'
				boldHead
				icon='close'
				onIconClick={props.onCloseClick}
			>
				<div className={`mt-10 mb-20 ${classes.wrapper}`}>
					<span className={`${classes.label}`}>Community icon :</span>
					<FileInput
						name='community-icon'
						id='communityIconPic'
						placeholder='.png / .jpg / .jpeg'
						accept='.jpg, .jpeg, .png'
						image
						onInput={onIconInput}
					/>

					<span className={`${classes.label}`}>Name of your community :</span>
					<Input
						type='text'
						placeholder='Name'
						value=''
						className={`${classes.inp}`}
					/>

					<span className={`${classes.label}`}>Topic of discussion :</span>
					<Input
						type='text'
						placeholder='Topic'
						value=''
						className={`${classes.inp}`}
					/>

					<span className={`${classes.label}`}>Description :</span>
					<Input
						type='textarea'
						placeholder='Description'
						value=''
						className={`${classes.inp}`}
						resize='vertical'
					/>
				</div>
				<div className={`mt-30 flx-c`}>
					<button className={`btn blue large shadow`}>Create community</button>
				</div>
			</Card>
		</>
	);
};

export default CreateCommunityCard;
