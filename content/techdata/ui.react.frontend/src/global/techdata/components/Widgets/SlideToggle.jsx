import React, { useEffect, useState } from 'react';

function SlideToggle({ toggled, onToggleChanged, readOnly }) {
	const [initialized, setInitialized] = useState(false);
	const [isToggled, setIsToggled] = useState(toggled ?? false);

	useEffect(() => {
		if (typeof onToggleChanged === 'function' && initialized) {
			onToggleChanged(isToggled);
		}
	}, [isToggled, initialized]);

	useEffect(() => {
		setInitialized(true);
	}, []);

	return (
		<div className={`cmp-slide-toggle ${readOnly ? 'cmp-slide-toggle--read-only' : ''}`}>
			<label className='cmp-slide-toggle__switch'>
				<input
					className='cmp-slide-toggle__switch__input'
					type='checkbox'
					onChange={() => {
						if (!readOnly) setIsToggled(!isToggled);
					}}
					checked={isToggled}
				></input>
				<span className='cmp-slide-toggle__switch__slider cmp-slide-toggle__switch__slider--round'></span>
			</label>
		</div>
	);
}

export default SlideToggle;
