import { JSX } from "preact";
import { useState, useRef } from "preact/hooks";

import { PostData, UserData } from "@/utils/types";
import MarkdownViewer from "../MarkdownEditor/MarkdownViewer";

import classes from "./PostView.module.css";
import { request } from "@/utils/utils";
import Kebab from "@/assets/icons/Kebab";
import usePortal from "@/hooks/usePortal";
import Card from "../Card/Card";
import List from "../UI/List/List";

type Props = {
	postData: PostData;
	communityName: string;
	communityIcon: string;
};

declare const __userData: UserData;

type ListItem = {
	name: string;
	onClick?: JSX.MouseEventHandler<HTMLLIElement>;
}[];

const PostView = ({ postData, ...props }: Props) => {
	const [postDataState, setPostDataState] = useState<PostData>({ ...postData });
	const [showPostOptions, setShowPostOptions] = useState(false);

	const onDeleteClick = async () => {
		if (!confirm("Are you sure you want to delete this post?")) {
			return;
		}
		try {
			const rawData = await request(`/api/posts/delete/${postDataState.id}/`);
			const res = await rawData.json();

			if (res.ok) {
				alert("Post deleted");
				location.reload();
			}
		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		}
	};

	const listItems: ListItem = [{ name: "Save Post" }];

	if (
		__userData?.username === postDataState.createdUser ||
		__userData?.username === postDataState.communityModerator
	) {
		listItems.push({ name: "Delete Post", onClick: onDeleteClick });
	}

	usePortal(
		<Card className={classes.card}>
			<List items={listItems} />
		</Card>,
		{
			show: showPostOptions,
			onBackdropClick: () => setShowPostOptions(false),
		}
	);

	const onVoteClick = async (action: "upvote" | "downvote") => {
		try {
			const rawData = await request(
				`/api/posts/${action}/${postDataState.id}/`
			);
			const res = await rawData.json();

			if (res.ok) {
				setPostDataState(res.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const onKebabClick = () => {
		setShowPostOptions((prev) => !prev);
	};

	return (
		<div className={`${classes.container} drop-shadow mt-40 mb-40`}>
			<div className={`${classes.head} lite-shadow`}>
				<div className={`flx-c`}>
					<img
						src={props.communityIcon}
						alt={props.communityName}
						className={`mr-20 lite-shadow ${classes.icon}`}
					/>
					<a href={`/x/${props.communityName}/`} className={`underline`}>
						x/{props.communityName}
					</a>
					<span>&nbsp;posted by&nbsp;</span>
					<span className={classes.userName}>
						s/{postDataState.createdUser}
					</span>
					<span>&nbsp;on&nbsp;{postDataState.createdDate}&nbsp;</span>
				</div>
				<div className={classes.kebab} onClick={onKebabClick}>
					<Kebab />
				</div>
			</div>
			<MarkdownViewer
				postData={postDataState}
				onDownvoteClick={() => onVoteClick("downvote")}
				onUpvoteClick={() => onVoteClick("upvote")}
			/>
		</div>
	);
};

export default PostView;
