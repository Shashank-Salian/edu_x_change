import { render, ComponentChild } from "preact";
import { useEffect } from "preact/hooks";

type Props = {
	show: boolean;
	showBackdrop?: boolean;
	closeOnBackdropClick?: boolean;
	onBackdropClick?: (e: MouseEvent) => void;
};

const usePortal = (comp: ComponentChild | null, props: Props) => {
	useEffect(() => {
		const ele = document.createElement("div");
		ele.id = "portal";
		document.body.appendChild(ele);

		const onBackdropClick = (e: MouseEvent) => {
			if (props.closeOnBackdropClick) document.body.removeChild(ele);
			if (props.onBackdropClick) props.onBackdropClick(e);
		};

		render(
			<>
				{props.show ? (
					<div
						onClick={onBackdropClick}
						className={
							props.showBackdrop === undefined || props.showBackdrop
								? "backdrop"
								: undefined
						}
					>
						<div style={{ zIndex: 3 }}>{comp}</div>
					</div>
				) : null}
			</>,
			ele
		);

		return () => {
			document.removeChild(ele);
		};
	}, []);
};

export default usePortal;
