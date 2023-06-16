import { useEffect, useState } from "preact/hooks";
import MarkdownViewer from "../MarkdownEditor/MarkdownViewer";
import { request } from "@/utils/utils";

type Props = {
	communityName?: string;
};

const PostView = (props: Props) => {
	const [postData, setPostData] = useState<any[]>([]);

	useEffect(() => {
		const getPosts = async () => {
			const raw_data = await request(
				`/api/community/posts/${props.communityName}`
			);
			const data = await raw_data.json();

			console.log(data);

			setPostData(data.data);
		};

		getPosts();
	}, []);

	return (
		<div>
			<div>
				{postData.map((p, i) => (
					<MarkdownViewer initialValue={p.body} key={i} />
				))}
			</div>
		</div>
	);
};

export default PostView;
