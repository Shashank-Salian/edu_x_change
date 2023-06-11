import { render, JSX } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";

import classes from "./post.module.css";
import Nav from "@/components/Nav/Nav";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import Select from "@/components/UI/Select/Select";
import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import { debounce, request } from "@/utils/utils";

type SelectInput = JSX.GenericEventHandler<HTMLSelectElement>;
type MessageData = { message: string; type: "error" | "success" | "normal" };

const Post = () => {
	const [title, setTitle] = useState("");
	const [communitySelected, setCommunitySelected] = useState<string>();
	const [communities, setCommunities] = useState([]);
	const [messageData, setMessageData] = useState<MessageData>();
	let editor: any;

	const draftPost = async (formData: FormData) => {
		try {
			const res = await request("/api/posts/draft/", formData, "POST");
			const data = await res.json();

			console.log(data);

			if (data.ok) {
				setMessageData({ message: "Drafted", type: "success" });
			}
		} catch (err) {
			console.log(err);
			setMessageData({
				message: "Something went wrong",
				type: "error",
			});
		}
	};

	const titleDebounceRef = useRef(
		debounce(async (t, cs) => {
			console.log(t, cs);

			const formData = new FormData();
			if (t) formData.append("title", t);
			if (cs) formData.append("community", cs);

			draftPost(formData);
		}, 2000)
	);

	const markdownDebounceRef = useRef(
		debounce((md) => {
			const formData = new FormData();

			if (md) {
				formData.append("body", md);
				draftPost(formData);
			}
		}, 2000)
	);

	const isFirstRenderRef = useRef(true);

	const onMarkdownInput = () => {
		markdownDebounceRef.current(editor.getMarkdown());
	};

	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}
		titleDebounceRef.current(title, communitySelected);
	}, [title, communitySelected]);

	useEffect(() => {
		const getCommunities = async () => {
			const res = await request("/api/community/mycommunities/");
			const data = await res.json();
			console.log(data);

			if (data?.error) {
				return;
			}

			if (data?.data?.length === 0) {
				console.log("no communities");
				return;
			}

			setCommunities(
				data.data.map((com: any) => ({ name: com.name, value: com.name }))
			);
		};

		getCommunities();
	}, []);

	return (
		<div className={classes.container}>
			<Nav />
			<main className={`container mt-30`}>
				<h2 className={`mb-20`}>Create Post :</h2>
				<div className={classes.inpContainer}>
					<span className={`mr-30`}>Choose community :</span>
					<Select
						options={communities}
						onInput={(e) => setCommunitySelected(e.currentTarget.value)}
					/>

					<span>Choose title :</span>
					<Input
						value={title}
						maxLength={100}
						placeholder='Enter title for your post'
						onInput={(e) => setTitle(e.currentTarget.value)}
					/>
				</div>

				<div className={`mt-30`}>
					<span>Post contents :</span>
					<MarkdownEditor
						className='mt-20'
						onEditorInitialized={(ed) => {
							editor = ed;
						}}
						onInput={onMarkdownInput}
					/>
				</div>
				<div className={`mt-30 ${classes.btnContainer}`}>
					<span data-type={messageData?.type}>{messageData?.message}</span>
					<Button>Submit</Button>
				</div>
			</main>
		</div>
	);
};

render(<Post />, document.getElementById("root") as HTMLElement);
