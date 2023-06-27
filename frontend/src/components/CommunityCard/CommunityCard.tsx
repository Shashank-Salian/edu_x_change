import { useEffect, useState } from "preact/hooks";

import { request } from "@/utils/utils";
import { PostData } from "@/utils/types";
import PostView from "../PostView/PostView";
import Button from "../UI/Button/Button";

import classes from "./CommunityCard.module.css";
import { CommunityData } from "@/utils/types";
import Spinner from "../UI/Spinner/Spinner";

type Props = {
	data: CommunityData;
};

const CommunityCard = ({ data }: Props) => {
	const [postData, setPostData] = useState<PostData[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const getPosts = async () => {
			try {
				setIsLoading(true);
				const raw_data = await request(`/api/community/posts/${data.name}/`);
				const postData = await raw_data.json();

				setIsLoading(false);
				console.log(postData);

				if (postData.ok) {
					setPostData(postData.data);
					return;
				}

				alert("Couldn't fetch posts");
			} catch (err) {
				setIsLoading(false);
				console.error(err);
				alert("Couldn't fetch posts, something went wrong!");
			}
		};

		getPosts();
	}, []);

	return (
		<div className={`${classes.container} drop-shadow`}>
			<Head data={data} />
			<div className={classes.pad}>
				<h2>Posts :</h2>

				{postData.length === 0 ? (
					isLoading ? (
						<div className='flx-c'>
							<Spinner />
						</div>
					) : (
						<h1 className={`mt-40`} style={{ textAlign: "center" }}>
							No posts found
						</h1>
					)
				) : (
					postData.map((post) => <PostView postData={post} key={post.id} />)
				)}
			</div>
		</div>
	);
};

const Head = ({ data }: Props) => {
	const onLeaveClick = async () => {
		try {
			const rawData = await request(`/api/community/leave/${data.name}/`);
			const reqData = await rawData.json();

			if (reqData.ok) {
				alert(reqData.message);
				location.reload();
				return;
			}

			alert(reqData.message);
		} catch (err) {
			console.error(err);
			alert("Something wen't wrong");
		}
	};

	const onJoinClick = async () => {
		try {
			const rawData = await request(`/api/community/join/${data.name}/`);
			const reqData = await rawData.json();

			if (reqData.ok) {
				// alert(reqData.message);
				location.reload();
				return;
			}

			alert(reqData.message);
		} catch (err) {
			console.error(err);
			alert("Something wen't wrong");
		}
	};

	return (
		<div className={`${classes.headContainer} ${classes.pad} lite-shadow`}>
			<div className={classes.left}>
				<div className={`mr-20`}>
					<img
						className={`${classes.icon} lite-shadow`}
						src={data.iconPath}
						alt={data.name}
					/>
				</div>
				<div className={`mr-20`}>
					<div>
						<h2>
							<span className={classes.x}>x/</span>
							{data.name}
						</h2>
						<span>
							Topic : <span style={{ fontWeight: "600" }}>{data.topic}</span>
						</span>
					</div>
					<p className={`mt-10 ${classes.desc}`}>{data.description}</p>
				</div>
			</div>
			<div className={classes.right}>
				<div className={`${classes.participants} mr-20`}>
					<span>participants</span>
					<h2>{data.participantsCount}</h2>
				</div>
				<div>
					<Button
						className={classes.joinBtn}
						color={data.userJoined ? "red" : undefined}
						onClick={data.userJoined ? onLeaveClick : onJoinClick}
					>
						{data.userJoined ? "Leave" : "Join"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CommunityCard;
