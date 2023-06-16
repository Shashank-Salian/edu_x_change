import { render } from "preact";

import Nav from "@/components/Nav/Nav";
import classes from "./x.module.css";
import CommunityCard from "@/components/CommunityCard/CommunityCard";

declare const __communityData:
	| {
			name: string;
			id: number;
			topic: string;
			description: string;
			moderator: string;
			createdDate: string;
			iconPath: string;
			participantsCount: number;
			userJoined: boolean;
	  }
	| undefined;

const X = () => {
	if (!__communityData)
		return <span>Community not found or internal server error</span>;

	console.log(__communityData);

	return (
		<div className={classes.container}>
			<Nav />
			<main className={`container mt-30`}>
				<h2 className={`mb-30`}>Community :</h2>
				<CommunityCard data={__communityData} />
			</main>
		</div>
	);
};

render(<X />, document.getElementById("root") as HTMLElement);
