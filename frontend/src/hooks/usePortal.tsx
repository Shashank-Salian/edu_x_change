import { render, ComponentChild } from "preact";
import { useEffect } from "preact/hooks";

type Props = {
	show: boolean;
	showBackdrop?: boolean;
	onBackdropClick?: (e: MouseEvent) => void;
};

const usePortal = (comp: ComponentChild | null, props: Props) => {
	useEffect(() => {
		if (props.show) {
			const ele = document.createElement("div");
			ele.id = "portal";
			document.body.appendChild(ele);

			const onBackdropClick = (e: MouseEvent) => {
				if (props.onBackdropClick) props.onBackdropClick(e);
			};

			render(
				<>
					<div className={`portal-container`}>
						{comp}
						<div
							onClick={onBackdropClick}
							className={
								props.showBackdrop === undefined || props.showBackdrop
									? "backdrop"
									: undefined
							}
						></div>
					</div>
				</>,
				ele
			);

			return () => {
				document.body.removeChild(ele);
			};
		}
	}, [props]);
};

export default usePortal;
