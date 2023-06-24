import { useRef, useState } from "preact/hooks";

import Logo from "@/assets/logos/ExcWritten";
import Button from "@/components/UI/Button/Button";
import classes from "./Nav.module.css";
import usePortal from "@/hooks/usePortal";
import CreateCommunityCard from "@/components/home/CreateCommunity/CreateCommunityCard";
import SearchInput from "../UI/Input/SearchInput";
import { debounce, request } from "@/utils/utils";
import { CommunityData } from "@/utils/types";

type Props = {};

const Nav = (_props: Props) => {
	const [showCreateCommunityCard, setShowCreateCommunityCard] = useState(false);
	const [searchVal, setSearchVal] = useState("");
	const [searchResults, setSearchResults] = useState<CommunityData[]>([]);

	const toggleCreateCommunityCard = () => {
		setShowCreateCommunityCard((old) => !old);
	};

	usePortal(<CreateCommunityCard onCloseClick={toggleCreateCommunityCard} />, {
		show: showCreateCommunityCard,
		onBackdropClick: toggleCreateCommunityCard,
	});

	const searchCommunity = async (searchTerm: string) => {
		if (searchTerm === "") {
			setSearchResults([]);
			return;
		}

		try {
			const rawData = await request(`/api/community/search/${searchTerm}`);
			const data = await rawData.json();

			if (data.ok) {
				setSearchResults(data.data);
				return;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const searchDebounceRef = useRef(debounce(searchCommunity, 250));

	return (
		<div className={`drop-shadow ${classes.container}`}>
			<div className={`container ${classes.wrapper}`}>
				<a href='/'>
					<Logo width='120' />
				</a>
				<div className={classes.searchContainer}>
					<SearchInput
						id='searchInp'
						name='search'
						placeholder='Search Community'
						value={searchVal}
						className='fw'
						suggestions={searchResults}
						onInput={({ currentTarget: { value } }) => {
							setSearchVal(() => {
								searchDebounceRef.current(value);
								return value;
							});
						}}
					/>
				</div>
				<div>
					<Button onClick={toggleCreateCommunityCard} className='mr-20'>
						Community +
					</Button>
					<a href='/post/'>
						<Button className='mr-20'>Post +</Button>
					</a>
					<a href='/login/'>
						<Button>Login</Button>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Nav;
