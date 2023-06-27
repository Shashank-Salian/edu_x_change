import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

import Nav from "@/components/Nav/Nav";
import type { PostData, UserData } from "@/types";

import classes from "./home.module.css";
import { request } from "@/utils/utils";
import PostView from "@/components/PostView/PostView";

declare const __userData: UserData | undefined;

const HomePage = () => {
	if (!__userData) return <span>Something went wrong!</span>;

	const [posts, setPosts] = useState<PostData[]>([]);

	useEffect(() => {
		const getPosts = async () => {
			try {
				const rawData = await request("/api/posts/recent/");
				const postData = await rawData.json();

				if (postData.ok) {
					setPosts(postData.data);
				}
			} catch (err) {
				console.error(err);
			}
		};

		getPosts();
	}, []);

	return (
		<div className={`${classes.container} main`}>
			<Nav />
			<div className={`container pad`}>
				<h2>Home</h2>

				{posts.map((post, i) => (
					<PostView postData={post} key={i} />
				))}
			</div>
		</div>
	);
};

render(<HomePage />, document.getElementById("root") as HTMLElement);
