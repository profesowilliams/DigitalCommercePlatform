import React, { useState } from 'react';
import Button from '../Widgets/Button';

function SearchCriteria({ componentProp, Filters, onSearchRequest, onClearRequest }) {
	let _filter = null;
	let [filterActive, setFilterActive] = useState(false);
	const [reset, setReset] = useState(false);
	const [expanded, setExpanded] = useState(false);

	function isEmptyOrSpaces(str) {
		return str === null || str.match(/^ *$/) !== null;
	}

	function handleChange(change) {
		_filter = change;
		if (_filter && !isEmptyOrSpaces(_filter)) {
			setFilterActive(true);
		} else {
			setFilterActive(false);
		}
	}

	function onSearch() {
		if (typeof onSearchRequest === 'function' && !isEmptyOrSpaces(_filter)) {
			onSearchRequest({ queryString: _filter });
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
		<div className={`cmp-search-criteria ${expanded ? 'cmp-search-criteria--expanded' : ''}`}>
			<div
				className='cmp-search-criteria__header'
				onClick={() => {
					setExpanded(!expanded);
				}}
			>
				<i className='fas fa-sliders-h'></i>
				<div className='cmp-search-criteria__header__title'>{componentProp?.title ?? 'Filter'}</div>
			</div>
			<div className={`cmp-search-criteria__content  ${!expanded ? 'cmp-search-criteria__content--hidden' : ''}`}>
				<div className='cmp-search-criteria__content__query-input'>
					<div className='cmp-search-criteria__content__query-input__container'>
						<Filters
							key={reset}
							componentProp={componentProp}
							onQueryChanged={(query) => handleChange(query)}
						></Filters>
					</div>
				</div>
				<div className='cmp-search-criteria__content__query-input__search'>
					<Button disabled={!filterActive} onClick={() => onSearch()}>
						{componentProp?.searchButtonLabel ?? 'Apply'}
					</Button>
					<div className='cmp-search-criteria__content__query-input__search__clear' onClick={() => onClear()}>
						{componentProp?.clearButtonLabel ?? 'Clear All Filters'}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SearchCriteria;
