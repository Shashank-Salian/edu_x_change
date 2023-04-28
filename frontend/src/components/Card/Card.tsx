import { ComponentChild } from "preact";

type Props = {
	heading?: ComponentChild;
	boldHead?: boolean;
	noShadow?: boolean;
	icon?: "close" | "meatball" | "kebab";
	bg?: string;
};

const Card = (props: Props) => {
	return (
		<div>
			<div>{props.boldHead ? <h2>{props.heading}</h2> : props.heading}</div>
		</div>
	);
};

export default Card;
