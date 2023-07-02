type Props = {
	className?: string;
	width?: string;
};

const Edit = (props: Props) => {
	return (
		<svg
			height={props.width || "64"}
			width={props.width || "64"}
			className={props.className}
			fill='none'
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M5.48126 10.8145C6.85652 9.43924 8.72179 8.66663 10.6667 8.66663H27.3334C28.4379 8.66663 29.3334 9.56206 29.3334 10.6666V10.6666C29.3334 11.7712 28.4379 12.6666 27.3334 12.6666H10.6667C9.78265 12.6666 8.93481 13.0178 8.30968 13.6429C7.68456 14.2681 7.33337 15.1159 7.33337 16V53.3333C7.33337 54.2174 7.68456 55.0652 8.30968 55.6903C8.9348 56.3154 9.78265 56.6666 10.6667 56.6666H48C48.8841 56.6666 49.7319 56.3154 50.3571 55.6903C50.9822 55.0652 51.3334 54.2174 51.3334 53.3333V36.6666C51.3334 35.5621 52.2288 34.6666 53.3334 34.6666V34.6666C54.4379 34.6666 55.3334 35.5621 55.3334 36.6666V53.3333C55.3334 55.2782 54.5608 57.1435 53.1855 58.5187C51.8102 59.894 49.945 60.6666 48 60.6666H10.6667C8.72179 60.6666 6.85653 59.894 5.48126 58.5187C4.10599 57.1435 3.33337 55.2782 3.33337 53.3333V16C3.33337 14.055 4.10599 12.1898 5.48126 10.8145Z'
				fill='black'
				fillRule='evenodd'
			/>
			<path
				d='M53.3333 7.00977C52.3634 7.00977 51.4333 7.39504 50.7475 8.08083L25.8059 33.0225L24.082 39.9179L30.9775 38.194L55.9191 13.2524C56.6049 12.5666 56.9902 11.6365 56.9902 10.6666C56.9902 9.69676 56.6049 8.76663 55.9191 8.08083C55.2333 7.39504 54.3032 7.00977 53.3333 7.00977ZM47.9191 5.25241C49.355 3.81647 51.3026 3.00977 53.3333 3.00977C55.364 3.00977 57.3116 3.81647 58.7475 5.25241C60.1834 6.68834 60.9902 8.63589 60.9902 10.6666C60.9902 12.6973 60.1834 14.6449 58.7475 16.0808L33.4142 41.4142C33.1579 41.6705 32.8367 41.8523 32.485 41.9402L21.8184 44.6069C21.1368 44.7773 20.4158 44.5776 19.9191 44.0808C19.4223 43.5841 19.2226 42.8631 19.393 42.1815L22.0597 31.5149C22.1476 31.1632 22.3294 30.8421 22.5857 30.5857L47.9191 5.25241Z'
				fill='black'
				fillRule='evenodd'
			/>
		</svg>
	);
};

export default Edit;