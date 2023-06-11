import { render, JSX } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";

import classes from "./post.module.css";
import Nav from "@/components/Nav/Nav";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import Select from "@/components/UI/Select/Select";
import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import { debounce, request } from "@/utils/utils";

type SelectInput = JSX.GenericEventHandler<
	HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
>;
type MessageData = { message: string; type: "error" | "success" | "normal" };

const Post = () => {
	const [title, setTitle] = useState("");
	const [communitySelected, setCommunitySelected] = useState<string>();
	const [communities, setCommunities] = useState([]);
	const [messageData, setMessageData] = useState<MessageData>();
	let editor: any;

	const draftPost = async (formData: FormData) => {
		try {
			setMessageData({
				message: "Drafting...",
				type: "normal",
			});
			const res = await request("/api/posts/draft/", formData, "POST");
			const data = await res.json();

			console.log(data);

			if (data.ok) {
				setMessageData({ message: "Drafted", type: "success" });
				return;
			}

			setMessageData({
				message: "Couldn't save, check if the post is valid",
				type: "error",
			});
		} catch (err) {
			console.log(err);
			setMessageData({
				message: "Something went wrong",
				type: "error",
			});
		}
	};

	const titleDebounceRef = useRef(
		debounce(async (formData: FormData) => {
			draftPost(formData);
		}, 2000)
	);

	const markdownDebounceRef = useRef(
		debounce((md) => {
			console.log(md === "");
			const formData = new FormData();

			if (md !== undefined && md !== null) {
				formData.append("body", md);
				draftPost(formData);
			}
		}, 2000)
	);

	// const isFirstRenderRef = useRef(true);

	// useEffect(() => {
	// 	if (isFirstRenderRef.current) {
	// 		isFirstRenderRef.current = false;
	// 		return;
	// 	}
	// 	titleDebounceRef.current(title, communitySelected);
	// }, [title, communitySelected]);

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

		const getDraftedPost = async () => {
			const res = await request("/api/posts/draft/");
			const data = await res.json();

			console.log(data);

			if (data.ok) {
				if (data.data.title) setTitle(data.data.title);
				if (data.data.communityName)
					setCommunitySelected(data.data.communityName);
				if (data.data.body) editor.setMarkdown(data.data.body);
			}
		};

		getCommunities();
		getDraftedPost();
	}, []);

	const onCommInput: SelectInput = (e) => {
		setCommunitySelected(() => {
			const newTitle = e.currentTarget.value;
			const formData = new FormData();
			formData.append("community", newTitle);
			titleDebounceRef.current(formData);
			return newTitle;
		});
	};

	const onTitleInput: SelectInput = (e) => {
		setTitle(() => {
			const newTitle = e.currentTarget.value;
			const formData = new FormData();
			formData.append("title", newTitle);
			titleDebounceRef.current(formData);
			return newTitle;
		});
	};

	const onMarkdownInput = () => {
		console.log("something happened");
		markdownDebounceRef.current(editor.getMarkdown());
	};

	const onImageInput = (blob: Blob | File, cb: Function) => {
		const sendImg = async () => {
			const formData = new FormData();
			formData.append("image", blob);

			const res = await request("/api/posts/image/", formData, "POST");
			const data = await res.json();
			if (data.ok) {
				cb(`${data.data}`, "");
			}
		};

		sendImg();
	};

	return (
		<div className={classes.container}>
			<Nav />
			<main className={`container mt-30`}>
				<h2 className={`mb-20`}>Create Post :</h2>
				<div className={classes.inpContainer}>
					<span className={`mr-30`}>Choose community :</span>
					<Select
						options={communities}
						value={communitySelected}
						onInput={onCommInput}
					/>

					<span>Choose title :</span>
					<Input
						value={title}
						maxLength={100}
						placeholder='Enter title for your post'
						onInput={onTitleInput}
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
						onImageInput={onImageInput}
					/>
				</div>
				<div className={`mt-30 ${classes.btnContainer}`}>
					<span data-type={messageData?.type} className={classes.message}>
						{messageData?.message}
					</span>
					<Button>Submit</Button>
				</div>
			</main>
		</div>
	);
};

render(<Post />, document.getElementById("root") as HTMLElement);
