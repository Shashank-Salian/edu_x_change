interface CommunityData {
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

interface PostData {
	id: number;
	title: string;
	body: string;
	community: string;
	createdUser: string;
	upvoteCount: number;
	downvoteCount: number;
	createdDate: string;
	upvoted: boolean;
	downvoted: boolean;
	notes: { name: string; link: string }[];
	communityModerator: string;
}

interface UserData {
	id: number;
	name: string;
	username: string;
	email: string;
	createdDate: string;
	isSuperuser: boolean;
	isStaff: boolean;
	isActive: boolean;
}

export type { CommunityData, PostData, UserData };
