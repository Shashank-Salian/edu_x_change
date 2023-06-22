import { PostData } from "@/utils/types";
import MarkdownViewer from "../MarkdownEditor/MarkdownViewer";

import classes from "./PostView.module.css";
import { useState } from "preact/hooks";
import { request } from "@/utils/utils";

type Props = {
	postData: PostData;
	communityName: string;
	communityIcon: string;
};

const PostView = ({ postData, ...props }: Props) => {
	const [postDataState, setPostDataState] = useState<PostData>({ ...postData });

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

	return (
		<div className={`${classes.container} drop-shadow mt-40 mb-40`}>
			<div className={`${classes.head} lite-shadow`}>
				<img
					src={props.communityIcon}
					alt={props.communityName}
					className={`mr-20 lite-shadow ${classes.icon}`}
				/>
				<a href={`/x/${props.communityName}/`} className={`underline`}>
					x/{props.communityName}
				</a>
				<span>&nbsp;posted by&nbsp;</span>
				<span className={classes.userName}>s/{postDataState.createdUser}</span>
				<span>&nbsp;on&nbsp;{postDataState.createdDate}&nbsp;</span>
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
