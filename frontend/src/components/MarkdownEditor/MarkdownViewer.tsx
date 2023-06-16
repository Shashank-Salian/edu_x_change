import { useEffect, useRef } from "preact/hooks";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

import classes from "./MarkdownEditor.module.css";

type Props = {
	initialValue?: string;
};

const MarkdownViewer = (props: Props) => {
	const viewerElRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const viewer = new Viewer({
			el: viewerElRef.current!,
			height: "100%",
			initialValue: props.initialValue,
		});

		console.log(viewer);
	}, []);

	return (
		<div className={classes.viewer}>
			<div ref={viewerElRef}></div>
		</div>
	);
};

export default MarkdownViewer;
