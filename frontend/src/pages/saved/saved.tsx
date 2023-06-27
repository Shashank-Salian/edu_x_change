import { useEffect, useState } from "preact/hooks";
import { render } from "preact";
import Nav from "@/components/Nav/Nav";
import { PostData, UserData } from "@/utils/types";

import classes from "./saved.module.css";
import PostView from "@/components/PostView/PostView";
import { request } from "@/utils/utils";
import Spinner from "@/components/UI/Spinner/Spinner";

declare const __userData: UserData;

const Saved = () => {
	const [savedPosts, setSavedPosts] = useState<PostData[] | null>(null);

	useEffect(() => {
		const getSavedPosts = async () => {
			try {
				const rawData = await request(`/api/posts/savedposts/`);
				const data = await rawData.json();

				if (data.ok) {
					console.log(data.data);
					setSavedPosts(data.data);
					return;
				}
				alert(data.message);
			} catch (err) {
				console.log(err);
				alert("Error fetching saved posts!");
			}
		};

		getSavedPosts();
	}, []);

	return (
		<div className={`main ${classes.container}`}>
			<Nav />
			<div className={`pad container`}>
				<h2>Saved Posts :</h2>
				{savedPosts === null ? (
					<div className='flx-c'>
						<Spinner />
					</div>
				) : savedPosts.length === 0 ? (
					<div className={`flx-c`}>
						<h2>No saved posts</h2>
					</div>
				) : (
					savedPosts.map((post, i) => <PostView key={i} postData={post} />)
				)}
			</div>
		</div>
	);
};

render(<Saved />, document.getElementById("root") as HTMLElement);
