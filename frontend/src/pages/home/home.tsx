import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import Nav from "@/components/Nav/Nav";
import type { PostData, UserData } from "@/types";

import classes from "./home.module.css";
import { request } from "@/utils/utils";
import PostView from "@/components/PostView/PostView";
import usePagination from "@/hooks/usePagination";

declare const __userData: UserData | undefined;

const HomePage = () => {
	if (!__userData) return <span>Something went wrong!</span>;

	const [posts, setPosts] = useState<PostData[]>([]);
	const [pauseScroll, setPauseScroll] = useState(false);
	const page = useRef(1);

	const getPosts = async () => {
		try {
			setPauseScroll(true);
			const rawData = await request(`/api/posts/recent/?page=${page.current}`);
			const postData = await rawData.json();

			if (postData.ok) {
				if (postData.code === "END_OF_PAGE") {
					setPauseScroll(true);
					return;
				}
				setPosts((old) => [...old, ...postData.data]);
			}
			setPauseScroll(false);
		} catch (err) {
			console.error(err);
			setPauseScroll(false);
		}
	};

	usePagination(
		null,
		100,
		() => {
			page.current = page.current + 1;
			getPosts();
		},
		pauseScroll
	);

	useEffect(() => {
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
