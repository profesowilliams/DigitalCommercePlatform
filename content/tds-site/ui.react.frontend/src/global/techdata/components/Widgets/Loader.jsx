import React, { Fragment, useEffect, useState } from 'react';

function Loader({ visible }) {
	const [isVisible, setIsVisible] = useState(visible ?? false);

	useEffect(() => {
		setIsVisible(visible);
	}, [visible]);

	return (
		<Fragment>
			{isVisible && (
				<div className='cmp-loader-roller'>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			)}
		</Fragment>
	);
}

export default Loader;
