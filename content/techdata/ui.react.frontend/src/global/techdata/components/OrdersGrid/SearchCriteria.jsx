import React, { useState } from 'react';
import QueryInput from '../Widgets/QueryInput';
import Button from '../Widgets/Button';

function SearchCriteria({ componentProp, onSearchRequest, onClearRequest }) {
	const defaultKeywordDropdown = {
		label: 'Keyword',
		items: [
			{ key: 'id', value: 'TD Order #' },
			{ key: 'customerPO', value: 'Customer PO' },
			{ key: 'manufacturer', value: 'Manufacturer' },
			{ key: 'createdFrom', value: 'From' },
			{ key: 'createdTo', value: 'To' },
		],
	};

	const config = {
		title: componentProp.title ?? 'Filter Orders',
		searchButtonLabel: componentProp.searchButtonLabel ?? 'Apply',
		inputPlaceholder: componentProp.inputPlaceholder ?? 'Enter Your Search',
		clearButtonLabel: componentProp.clearButtonLabel ?? 'Clear All Filters',
		keywordDropdown: componentProp.keywordDropdown ?? defaultKeywordDropdown,
	};

	let _filter = null;
	let [filterActive, setFilterActive] = useState(false);
	const [reset, setReset] = useState(false);

	function handleChange(change) {
		_filter = change;
		if (_filter && _filter.value !== '') {
			setFilterActive(true);
		} else {
			setFilterActive(false);
		}
	}

	function onSearch() {
		if (typeof onSearchRequest === 'function' && _filter) {
			onSearchRequest({ queryString: `&${_filter.key}=${_filter.value}` });
		}
	}

	function onClear() {
		if (typeof onClearRequest === 'function') {
			onClearRequest();
		}
		setReset(!reset);
		setFilterActive(false);
	}

	return (
		<div className='cmp-search-criteria'>
			<div className='cmp-search-criteria__query-input'>
				{/* <div className='cmp-search-criteria__query-input__prefix'>{config.keywordDropdown.label}:</div> */}
				<div className='cmp-search-criteria__query-input__container'>
					<QueryInput
						key={reset}
						items={config.keywordDropdown.items}
						placeholder={config.inputPlaceholder}
						onQueryChanged={(query) => {
							handleChange(query);
						}}
					></QueryInput>
				</div>
			</div>

			<div className='cmp-search-criteria__query-input__search'>
				<Button disabled={!filterActive} onClick={() => onSearch()}>
					{config.searchButtonLabel}
				</Button>
				<div className='cmp-search-criteria__query-input__search__clear' onClick={() => onClear()}>
					{config.clearButtonLabel}
				</div>
			</div>
		</div>
	);
}

export default SearchCriteria;
