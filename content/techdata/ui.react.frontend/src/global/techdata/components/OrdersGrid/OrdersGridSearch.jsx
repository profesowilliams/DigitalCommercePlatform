import React, { useRef } from 'react';
import QueryInput from '../Widgets/QueryInput';

function OrdersGridSearch({ componentProp, onQueryChanged }) {
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

	const _query = useRef({});

	function dispatchQueryChange(query) {
		let keywordQuery =
			query.keywordQuery.key && query.keywordQuery.value
				? `&${query.keywordQuery.key}=${query.keywordQuery.value}`
				: '';
		let concatedQuery = `${keywordQuery}`;
		onQueryChanged(concatedQuery);
	}

	function handleKeywordFilterChange(change) {
		if (change) {
			_query.current.keywordQuery = change;
			dispatchQueryChange(_query.current);
		}
	}

	return (
		<div className='cmp-orders-grid__search'>
			<QueryInput
				key={componentProp}
				items={config.keywordDropdown.items}
				placeholder={config.inputPlaceholder}
				onQueryChanged={(query) => {
					handleKeywordFilterChange(query);
				}}
			></QueryInput>
		</div>
	);
}

export default OrdersGridSearch;
