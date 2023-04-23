import { render } from "preact";

const Card = () => (
	<div>
		<h2>This is a login page</h2>
	</div>
);

render(<Card />, document.getElementById("root") as HTMLElement);
