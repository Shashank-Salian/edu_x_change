import { useState } from "preact/hooks";

import Logo from "@/assets/logos/ExcWritten";

import classes from "./Nav.module.css";
import Input from "../UI/Input/Input";
import usePortal from "@/hooks/usePortal";
import CreateCommunityCard from "@/components/home/CreateCommunity/CreateCommunityCard";

type Props = {};

const Nav = (_props: Props) => {
	const [showCreateCommunityCard, setShowCreateCommunityCard] = useState(false);

	const toggleCreateCommunityCard = () => {
		setShowCreateCommunityCard((old) => !old);
	};

	usePortal(<CreateCommunityCard onCloseClick={toggleCreateCommunityCard} />, {
		show: showCreateCommunityCard,
		onBackdropClick: toggleCreateCommunityCard,
	});

	return (
		<div className={`drop-shadow ${classes.container}`}>
			<div className={`container ${classes.wrapper}`}>
				<a href='/'>
					<Logo width='120' />
				</a>
				<div className={classes.searchContainer}>
					<Input
						type='search'
						id='searchInp'
						name='search'
						placeholder='Search Community'
						value=''
						className='fw'
					/>
				</div>
				<div>
					<button
						className={`btn blue mr-20`}
						onClick={toggleCreateCommunityCard}
					>
						Create community +
					</button>
				</div>
			</div>
		</div>
	);
};

export default Nav;
