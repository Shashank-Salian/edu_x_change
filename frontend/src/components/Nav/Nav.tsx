import Logo from "@/assets/logos/ExcWritten";

import classes from "./Nav.module.css";
import Input from "../UI/Input/Input";
import usePortal from "@/hooks/usePortal";
import Card from "../Card/Card";

type Props = {};

const Nav = (_props: Props) => {
	usePortal(<Card heading='Create Community' />, {
		show: true,
		closeOnBackdropClick: true,
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
						blackLbl
					/>
				</div>
				<div>
					<button className={`btn blue mr-20`}>Create community +</button>
				</div>
			</div>
		</div>
	);
};

export default Nav;
