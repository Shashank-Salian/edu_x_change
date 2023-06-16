import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import Nav from "@/components/Nav/Nav";
import { request } from "@/utils/utils";

import classes from "./home.module.css";

type UserInfo = {
	fullName: string;
	email: string;
	username: string;
	isActive: boolean;
};

const HomePage = () => {
	const [userInfo, setUserInfo] = useState<UserInfo>();

	const getUserInfo = async () => {
		const res = await request("/api/users/userinfo/");
		const uInfo = await res.json();

		setUserInfo(uInfo);
	};

	useEffect(() => {
		getUserInfo();
	}, []);

	return (
		<div className={classes.container}>
			<Nav />
			<h1>Home</h1>
			{userInfo && (
				<>
					<p>{userInfo.fullName}</p>
					<p>{userInfo.email}</p>
					<p>{userInfo.username}</p>
					<p>{userInfo.isActive}</p>
				</>
			)}
			{/* {communityData.name}
			<br />
			{communityData &&
				communityData.participants.map((e: any) => <span>{e}</span>)} */}
		</div>
	);
};

render(<HomePage />, document.getElementById("root") as HTMLElement);
