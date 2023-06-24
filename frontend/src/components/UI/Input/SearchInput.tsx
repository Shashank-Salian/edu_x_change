import { JSX } from "preact";
import Input from "./Input";

import classes from "./SearchInput.module.css";
import { CommunityData } from "@/utils/types";

type Props = {
	className?: string;
	id?: string;
	name?: string;
	whiteLbl?: boolean;
	onInput?: JSX.GenericEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	placeholder?: string;
	value: string;
	suggestions?: CommunityData[];
};

const SearchInput = (props: Props) => {
	return (
		<div className={classes.container}>
			<Input
				className={props.className}
				id={props.id}
				name={props.name}
				whiteLbl={props.whiteLbl}
				onInput={props.onInput}
				placeholder={props.placeholder}
				value={props.value}
				type='search'
			/>
			{props.value !== "" &&
			props.suggestions &&
			props.suggestions.length === 0 ? (
				<ul className={`drop-shadow ${classes.listContainer}`}>
					<li className={classes.list}>No results</li>
				</ul>
			) : null}
			{props.suggestions && props.suggestions.length > 0 ? (
				<ul className={`drop-shadow ${classes.listContainer}`}>
					{props.suggestions?.map((item, i) => (
						<li key={i}>
							<a
								href={`/x/${item.name}`}
								className={`mb-10 mt-10 ${classes.list}`}
							>
								<div className={classes.lhs}>
									<img
										src={item.iconPath}
										alt={item.name}
										width={"40px"}
										height={"40px"}
										className={`mr-10 ${classes.icon}`}
									/>
									<div className={classes.nameContainer}>
										<span className={classes.name}>{item.name}</span>
										<span className={classes.desc}>{item.topic}</span>
									</div>
								</div>
								<span>{item.participantsCount}</span>
							</a>
							<hr />
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default SearchInput;
