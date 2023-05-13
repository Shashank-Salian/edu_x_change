import { ComponentChild, JSX } from "preact";

import classes from "./Card.module.css";
import Cross from "@/assets/icons/Cross";

type Props = {
	heading?: ComponentChild;
	boldHead?: boolean;
	noShadow?: boolean;
	icon?: "close" | "meatball" | "kebab";
	bg?: string;
	children?: ComponentChild;
	className?: string;
	onIconClick?: JSX.MouseEventHandler<HTMLDivElement>;
};

const Card = (props: Props) => {
	return (
		<div
			className={`drop-shadow ${classes.container} ${
				!props.heading ? classes.pad : ""
			} ${props.className || ""}`}
		>
			{props.heading ? (
				<div className={`${classes.heading}`}>
					{props.boldHead ? <h2>{props.heading}</h2> : props.heading}
					{props.icon ? (
						<div className={classes.icon} onClick={props.onIconClick}>
							{props.icon === "close" ? <Cross width='24' /> : null}
						</div>
					) : null}
				</div>
			) : null}
			<div className={classes.body}>{props.children}</div>
		</div>
	);
};

export default Card;
