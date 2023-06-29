import { useEffect, useRef, useState } from "preact/hooks";

import { request } from "@/utils/utils";
import { PostData, UserData } from "@/utils/types";
import PostView from "../PostView/PostView";
import Button from "../UI/Button/Button";

import classes from "./CommunityCard.module.css";
import { CommunityData } from "@/utils/types";
import Spinner from "../UI/Spinner/Spinner";
import usePortal from "@/hooks/usePortal";
import Card from "../Card/Card";
import ProfileList from "../UI/List/ProfileList";
import usePagination from "@/hooks/usePagination";

type Props = {
	data: CommunityData;
};

declare const __userData: UserData;

const CommunityCard = ({ data }: Props) => {
	const [postData, setPostData] = useState<PostData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pauseScroll, setPauseScroll] = useState(false);
	const page = useRef(1);

	const getPosts = async () => {
		try {
			setPauseScroll(true);
			setIsLoading(true);
			const raw_data = await request(
				`/api/community/posts/${data.name}/?page=${page.current}`
			);
			const postData = await raw_data.json();

			setIsLoading(false);
			console.log(postData);

			if (postData.ok) {
				if (postData.code === "END_OF_PAGE") {
					setPauseScroll(true);
					return;
				}
				setPauseScroll(false);
				setPostData((old) => [...old, ...postData.data]);
				return;
			}

			setPauseScroll(false);
			alert("Couldn't fetch posts");
		} catch (err) {
			setPauseScroll(false);
			setIsLoading(false);
			console.error(err);
			alert("Couldn't fetch posts, something went wrong!");
		}
	};

	useEffect(() => {
		getPosts();
	}, []);

	usePagination(
		null,
		100,
		() => {
			page.current++;
			getPosts();
		},
		pauseScroll
	);

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
	const [participants, setParticipants] = useState<UserData[]>([]);
	const [showParticipants, setShowParticipants] = useState(false);

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

	const onParticipantsClick = async () => {
		try {
			const rawData = await request(
				`/api/community/participants/${data.name}/`
			);
			const reqData = await rawData.json();

			if (reqData.ok) {
				setParticipants(reqData.data);
				setShowParticipants(true);
				return;
			}

			alert(reqData.message);
		} catch (err) {
			console.error(err);
			alert("Something wen't wrong");
		}
	};

	const closeParticipants = () => {
		setShowParticipants(false);
	};

	const onRemoveParticipantsClick = async (username: string) => {
		console.log(username);
		try {
			const rawData = await request(
				`/api/community/removeparticipant/${data.name}?user=${username}`
			);
			const resData = await rawData.json();

			if (resData.ok) {
				alert(resData.message);
				setParticipants(resData.data);
				return;
			}

			alert(resData.message);
		} catch (err) {
			console.error(err);
			alert("Something wen't wrong");
		}
	};

	usePortal(
		<Card
			fw
			heading='Participants :'
			boldHead
			icon='close'
			onIconClick={closeParticipants}
		>
			<ProfileList
				items={participants.map((user) => ({
					name: user.username,
					icon: user.avatar,
					desc: user.name,
					link: `/s/${user.username}`,
					rhs:
						data.moderator === user.username ? (
							"M"
						) : data.moderator === __userData?.username ? (
							<Button
								color='red'
								onClick={() => onRemoveParticipantsClick(user.username)}
							>
								Remove
							</Button>
						) : undefined,
				}))}
			/>
		</Card>,
		{
			show: showParticipants,
			onBackdropClick: closeParticipants,
		}
	);

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
				<Button
					onClick={onParticipantsClick}
					color='transp'
					className={`${classes.participants} mr-20`}
				>
					<span>participants</span>
					<h2>{data.participantsCount}</h2>
				</Button>
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
