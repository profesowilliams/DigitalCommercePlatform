import React, { useRef } from 'react';
import QueryInput from '../Widgets/QueryInput';
import SimpleDropDown from '../Widgets/SimpleDropDown';
import SimpleDatePicker from '../Widgets/SimpleDatePicker';
import isNotEmpty from '../../helpers/IsNotNullOrEmpty';

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
		keywordDropdown: isNotEmpty(componentProp?.keywordDropdown)
			? componentProp?.keywordDropdown
			: defaultKeywordDropdown,
		vendorsDropdown: isNotEmpty(componentProp?.vendorsDropdown)
			? componentProp?.vendorsDropdown
			: defaultVendorsDropdown,
		inputPlaceholder: componentProp?.inputPlaceholder ?? 'Enter Your Search',
		fromLabel: componentProp?.fromLabel ?? 'From',
		toLabel: componentProp?.toLabel ?? 'To',
		datePlaceholder: componentProp?.datePlaceholder ?? 'MM/DD/YYYY',
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
		let from = query.from?.key && query.from?.value ? `&from=${new Date(query.from.value).toISOString()}` : '';
		let to = query.to?.key && query.to?.value ? `&to=${new Date(query.to.value).toISOString()}` : '';
		let concatedQuery = `${keywordQuery}${manufacturer}${from}${to}`;
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

	function handleFromFilterChange(change) {
		_query.current.from = change;
		dispatchQueryChange(_query.current);
	}

	function handleToFilterChange(change) {
		_query.current.to = change;
		dispatchQueryChange(_query.current);
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
			<SimpleDatePicker
				pickerKey={'from'}
				placeholder={config.datePlaceholder}
				label={config.fromLabel}
				onSelectedDateChanged={handleFromFilterChange}
			></SimpleDatePicker>
			<SimpleDatePicker
				pickerKey={'to'}
				placeholder={config.datePlaceholder}
				label={config.toLabel}
				onSelectedDateChanged={handleToFilterChange}
			></SimpleDatePicker>
		</div>
	);
}

export default OrdersGridSearch;
