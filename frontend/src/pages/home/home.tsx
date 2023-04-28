import { render } from "preact";
import Nav from "@/components/Nav/Nav";

import classes from "./home.module.css";

const HomePage = () => (
	<div className={classes.container}>
		<Nav />
		<h1>Home</h1>
	</div>
);

render(<HomePage />, document.getElementById("root") as HTMLElement);
