import { render } from "preact";

import classes from "./post.module.css";
import Nav from "@/components/Nav/Nav";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";

const Post = () => {
	return (
		<div className={classes.container}>
			<Nav />
			<main className={`container mt-40 mb-40`}>
				<h1>Create Post</h1>
				<MarkdownEditor />
			</main>
		</div>
	);
};

render(<Post />, document.getElementById("root") as HTMLElement);
