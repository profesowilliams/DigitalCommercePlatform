import React, { useRef } from 'react';
import QueryInput from '../Widgets/QueryInput';
import SimpleDropDown from '../Widgets/SimpleDropDown';

function OrdersGridSearch({ componentProp, onQueryChanged }) {
	const defaultKeywordDropdown = {
		label: 'Keyword',
		items: [
			{ key: 'id', value: 'TD Order #' },
			{ key: 'customerPO', value: 'Customer PO' },
		],
	};

	const defaultVendorsDropdown = {
		label: 'Vendors',
		items: [
			{ key: 'allVendors', value: 'All Vendors' },
			{ key: 'cisco', value: 'Cisco' },
		],
	};

	const config = {
		keywordDropdown: componentProp?.keywordDropdown ?? defaultKeywordDropdown,
		vendorsDropdown: componentProp?.vendorsDropdown ?? defaultVendorsDropdown,
		inputPlaceholder: componentProp?.inputPlaceholder ?? 'Enter Your Search',
	};

	const _query = useRef({});

	function dispatchQueryChange(query) {
		let keywordQuery =
			query.keywordQuery?.key && query.keywordQuery?.value
				? `&${query.keywordQuery.key}=${query.keywordQuery.value}`
				: '';
		let manufacturer =
			query.manufacturer?.key && query.manufacturer?.key !== 'allVendors'
				? `&manufacturer=${query.manufacturer.key}`
				: '';
		let concatedQuery = `${keywordQuery}${manufacturer}`;
		onQueryChanged(concatedQuery);
	}

	function handleKeywordFilterChange(change) {
		if (change) {
			_query.current.keywordQuery = change;
			dispatchQueryChange(_query.current);
		}
	}

	function handleVendorFilterChange(change) {
		if (change) {
			_query.current.manufacturer = change;
			dispatchQueryChange(_query.current);
		}
	}

	return (
		<div className='cmp-orders-grid__search'>
			<QueryInput
				key={'keyword'}
				items={config.keywordDropdown.items}
				placeholder={config.inputPlaceholder}
				onQueryChanged={handleKeywordFilterChange}
			></QueryInput>
			<SimpleDropDown
				key={'vendors'}
				items={config.vendorsDropdown.items}
				onItemSelected={handleVendorFilterChange}
			></SimpleDropDown>
		</div>
	);
}

export default OrdersGridSearch;
