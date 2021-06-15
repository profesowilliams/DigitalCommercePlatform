import React, { useState } from 'react';
import SimpleDropDown from './SimpleDropDown';
import TextInput from './TextInput';

function QueryInput({ items, placeholder, onQueryChanged }) {
	let _filterValue = null;
	const [filterKey, setFilterKey] = useState(null);

	function isEmptyOrSpaces(str) {
		return str === null || str.match(/^ *$/) !== null;
	}

	function textInputChanged(value) {
		_filterValue = value;
		if (filterKey) {
			onQueryChanged({ key: filterKey, value: _filterValue });
		}
	}

	function dropDownValueChanged(item) {
		setFilterKey(item.key);
		if (!isEmptyOrSpaces(_filterValue)) {
			onQueryChanged({ key: filterKey, value: _filterValue });
		}
	}

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
