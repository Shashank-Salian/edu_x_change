import { JSX } from "preact";

import classes from "./List.module.css";

type Props = {
	items?: { name: string; onClick?: JSX.MouseEventHandler<HTMLLIElement> }[];
	className?: string;
};

const List = (props: Props) => {
	return (
		<ul className={`${props.className || ""} ${classes.container}`}>
			{props.items?.map((item, i) => (
				<li className={`${classes.item}`} key={i} onClick={item.onClick}>
					{item.name}
				</li>
			))}
		</ul>
	);
};

export default List;
