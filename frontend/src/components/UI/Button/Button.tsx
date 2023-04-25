import { JSX } from "preact";

type Props = {
	children: JSX.Element | JSX.Element[];
};

const Button = (props: Props) => {
	return <button>{props.children}</button>;
};

export default Button;
