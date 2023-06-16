import PostView from "../PostView/PostView";
import Button from "../UI/Button/Button";

import classes from "./CommunityCard.module.css";

type Props = {
	data: {
		name: string;
		id: number;
		topic: string;
		description: string;
		moderator: string;
		createdDate: string;
		iconPath: string;
		participantsCount: number;
		userJoined: boolean;
	};
};

const CommunityCard = ({ data }: Props) => {
	return (
		<div className={`${classes.container} drop-shadow`}>
			<Head data={data} />
			<div className={classes.pad}>
				<h2>Posts :</h2>

				<PostView communityName={data.name} />
			</div>
		</div>
	);
};

const Head = ({ data }: Props) => {
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
					<h2>
						<span className={classes.x}>x/</span>
						{data.name}
					</h2>
					<p className={`mt-10 ${classes.desc}`}>{data.description}</p>
				</div>
			</div>
			<div className={classes.right}>
				<div className={`${classes.participants} mr-20`}>
					<span>participants</span>
					<h2>{data.participantsCount}</h2>
				</div>
				<div>
					<Button className={classes.joinBtn}>
						{data.userJoined ? "Joined" : "Join"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CommunityCard;
