import React, { useEffect, useState, useRef } from 'react';

function SimpleDropDown({ items, selectedIndex, onItemSelected }) {
	const [expanded, setExpanded] = useState(false);
	const [selectedItem, setSelectedItem] = useState(items[selectedIndex ?? 0] ?? null);
	const dropDownBodyRef = useRef(null);
	const dropDownHeaderRef = useRef(null);

	function selectedItemChanged(item) {
		setSelectedItem(item);
		setExpanded(false);
	}

	function onClick(event) {
		if (!dropDownHeaderRef.current?.contains(event.target) && !dropDownBodyRef.current?.contains(event.target)) {
			setExpanded(false);
		}
	}

	useEffect(() => {
		window.addEventListener('mousedown', onClick);
		return () => {
			window.removeEventListener('mousedown', onClick);
		};
	}, []);

	useEffect(() => {
		if (selectedIndex) {
			setSelectedItem(items[selectedIndex] ?? null);
		}
	}, [selectedIndex]);

	useEffect(() => {
		if (typeof onItemSelected === 'function') {
			onItemSelected(selectedItem);
		}
	}, [selectedItem]);

	return (
		<div className={`cmp-simple-drop-down ${expanded ? ' cmp-simple-drop-down--expanded' : ''}`}>
			<div className='cmp-simple-drop-down__selection' onClick={() => setExpanded(!expanded)} ref={dropDownHeaderRef}>
				{selectedItem?.value ?? selectedItem}
				<i className='fas fa-chevron-down'></i>
			</div>
			{expanded ? (
				<div className='cmp-simple-drop-down__list' ref={dropDownBodyRef}>
					<ul className='cmp-simple-drop-down__list__content'>
						{items.map((item, index) => (
							<li key={`${item.value ?? item}${index}`} className='cmp-simple-drop-down__list__content__item'>
								<div
									className='cmp-simple-drop-down__list__content__item__container'
									onClick={() => selectedItemChanged(item)}
								>
									{item.value ?? item}
								</div>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

export default SimpleDropDown;
