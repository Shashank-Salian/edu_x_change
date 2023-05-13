import { JSX } from "preact";
import { useState } from "preact/hooks";

import Card from "@/components/Card/Card";
import Input from "@/components/UI/Input/Input";

import classes from "./CreateCommunityCard.module.css";
import FileInput from "@/components/UI/Input/FileInput";

import { getCookie } from "@/utils/utils";

type Props = {
	onCloseClick?: JSX.MouseEventHandler<HTMLDivElement>;
};

type IconData = {
	fileName: string | null;
	fileData: string | null;
};

const CreateCommunityCard = (props: Props) => {
	const [iconInpData, setIconInpData] = useState<File | null>(null);
	const [textInpData, setTextInpData] = useState({
		commName: {
			name: "community-name",
			value: "",
		},
		topic: {
			name: "community-topic",
			value: "",
		},
		description: {
			name: "community-description",
			value: "",
		},
	});

	const onIconInput: JSX.GenericEventHandler<HTMLInputElement> = (e) => {
		const { files } = e.currentTarget;

		if (files && files.length !== 0) {
			const [file] = files;
			setIconInpData(file);
		}
	};

	const onTextDataInput: JSX.GenericEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e) => {
		setTextInpData((prev) => {
			const newState = { ...prev };
			switch (e.currentTarget.name) {
				case newState.commName.name:
					newState.commName.value = e.currentTarget.value;
					break;
				case newState.topic.name:
					newState.topic.value = e.currentTarget.value;
					break;
				case newState.description.name:
					newState.description.value = e.currentTarget.value;
					break;
			}
			return newState;
		});
	};

	const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (
			textInpData.commName.value.length > 2 &&
			textInpData.topic.value.length > 2
		) {
			const formData = new FormData();
			formData.append("communityName", textInpData.commName.value);
			formData.append("topic", textInpData.topic.value);
			// formData.append("description", textInpData.description.value);

			if (iconInpData) {
				formData.append("communityIcon", iconInpData);
			}

			console.log(formData.entries());

			try {
				const rawRes = await fetch("/api/community/create/", {
					method: "POST",
					headers: new Headers({
						"X-CSRFToken": getCookie("csrftoken")!,
					}),
					body: formData,
				});
				const res = await rawRes.json();
				console.log(res);
			} catch (err) {
				console.error(err);
			}
		}
	};

	return (
		<>
			<Card
				className={`${classes.container}`}
				heading='Create Community :'
				boldHead
				icon='close'
				onIconClick={props.onCloseClick}
			>
				<form action='/api/community/create/' method='post' onSubmit={onSubmit}>
					<div className={`mt-10 mb-20 ${classes.wrapper}`}>
						<span className={`${classes.label}`}>Community icon :</span>
						<FileInput
							name='community-icon'
							id='communityIconPic'
							placeholder={
								iconInpData ? iconInpData.name : ".png / .jpg / .jpeg"
							}
							accept='.jpg, .jpeg, .png'
							image
							onInput={onIconInput}
							className={classes.inp}
						/>
						<span className={`${classes.label}`}>Name of your community :</span>
						<Input
							type='text'
							placeholder='Name'
							value={textInpData.commName.value}
							name={textInpData.commName.name}
							className={`${classes.inp}`}
							onInput={onTextDataInput}
							required
						/>
						<span className={`${classes.label}`}>Topic of discussion :</span>
						<Input
							type='text'
							placeholder='Topic'
							value={textInpData.topic.value}
							name={textInpData.topic.name}
							className={`${classes.inp}`}
							onInput={onTextDataInput}
							required
						/>
						<span className={`${classes.label}`}>Description :</span>
						<Input
							type='textarea'
							placeholder='Description'
							value={textInpData.description.value}
							name={textInpData.description.name}
							className={`${classes.inp}`}
							onInput={onTextDataInput}
							resize='vertical'
						/>
					</div>
					<div className={`mt-30 flx-c`}>
						<button className={`btn blue large shadow`} type='submit'>
							Create community
						</button>
					</div>
				</form>
			</Card>
		</>
	);
};

export default CreateCommunityCard;
