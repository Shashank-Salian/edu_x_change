import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import Prism from "prismjs";
import "prismjs/themes/prism.min.css";

import classes from "./MarkdownEditor.module.css";
import Upvote from "@/assets/icons/Upvote";

type Props = {
	title?: string;
	initialValue?: string;
	voteCount?: string | number;
	className?: string;
	onUpvoteClick?: JSX.MouseEventHandler<HTMLDivElement>;
	onDownvoteClick?: JSX.MouseEventHandler<HTMLDivElement>;
	upvoted?: boolean;
	downvoted?: boolean;
};

const MarkdownViewer = (props: Props) => {
	const viewerElRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const viewer = new Viewer({
			el: viewerElRef.current!,
			height: "100%",
			initialValue: props.initialValue,
			plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
		});

		console.log(viewer);
	}, []);

	return (
		<div
			className={`${classes.viewerContainer} ${props.className || undefined}`}
		>
			<div className={classes.viewerWrapper}>
				<div className={`mr-20`}>
					<div className={classes.btn} onClick={props.onUpvoteClick}>
						<Upvote width='36' fill={props.upvoted} />
					</div>
					<p className={`mt-5 mb-5 ${classes.count}`}>{props.voteCount}</p>
					<div className={classes.btn} onClick={props.onDownvoteClick}>
						<Upvote down width='36' fill={props.downvoted} />
					</div>
				</div>
				<div>
					<h1 className={`mb-30`}>{props.title}</h1>
					<div ref={viewerElRef}></div>
				</div>
			</div>
		</div>
	);
};

export default MarkdownViewer;
