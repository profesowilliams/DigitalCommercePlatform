import React, { useEffect, useState } from 'react';
import SimpleDropDown from './SimpleDropDown';

function QueryInput({ items, placeholder, onQueryChanged }) {
	const [filterKey, setFilterKey] = useState(null);
	const [filterValue, setFilterValue] = useState(null);

	function textInputChanged(value) {
		setFilterValue(value);
	}

	function dropDownValueChanged(item) {
		setFilterKey(item.key);
	}

	useEffect(() => {
		if (filterKey) {
			onQueryChanged({ key: filterKey, value: filterValue });
		}
	}, [filterKey, filterValue]);

	return (
		<span className='cmp-query-input'>
			<SimpleDropDown items={items} onItemSelected={(item) => dropDownValueChanged(item)}></SimpleDropDown>
			<input
				className='cmp-query-input__input'
				type='text'
				placeholder={placeholder}
				onChange={(event) => textInputChanged(event.target.value)}
				value={null}
			/>
		</span>
	);
}
export default QueryInput;
