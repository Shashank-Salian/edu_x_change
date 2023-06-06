import { useRef, useEffect } from "preact/hooks";

import Editor from "@toast-ui/editor";
// import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/toastui-editor.css";
// import "@toast-ui/editor/toastui-editor-dark.css";
// import "@toast-ui/editor/toastui-editor-viewer.css";
// import "@toast-ui/editor/toastui-editor-only.css";

import classes from "./MarkdownEditor.module.css";

type Props = {};

const MarkdownEditor = () => {
	const editorRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		console.log(editorRef.current);
		const editor = new Editor({
			el: editorRef.current,
			height: "500px",
			initialEditType: "markdown",
			previewStyle: "vertical",
		});

		editor.getMarkdown();
	}, []);

	return (
		<div className={classes.container}>
			<div ref={editorRef}></div>
		</div>
	);
};

export default MarkdownEditor;
