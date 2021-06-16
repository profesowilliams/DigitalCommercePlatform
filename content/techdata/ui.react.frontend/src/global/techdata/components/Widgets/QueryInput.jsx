import React, { useEffect, useState } from 'react';
import SimpleDropDown from './SimpleDropDown';
import TextInput from './TextInput';

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
			<TextInput
				label={placeholder}
				value={null}
				onChange={(event) => textInputChanged(event.target.value)}
			></TextInput>
		</span>
	);
}
export default QueryInput;
