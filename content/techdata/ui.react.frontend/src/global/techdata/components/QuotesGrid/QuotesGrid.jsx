import React from 'react';
import Grid from '../Grid/Grid';
import useGridFiltering from '../../hooks/useGridFiltering';
import SearchCriteria from '../SearchCriteria/SearchCriteria';
import QuotesGridSearch from './QuotesGridSearch';

function QuotesGrid(props) {
	const componentProp = JSON.parse(props.componentProp);
	const filteringExtension = useGridFiltering();

	const { spaDealsIdLabel } = componentProp;

	const getDateTransformed = (dateUTC) => {
		const formatedDate = new Date(dateUTC).toLocaleDateString();
		return formatedDate;
	};

	const getDealsIdLabel = (deals) =>
		deals && deals.length > 1 ? spaDealsIdLabel : deals && deals.length === 1 ? deals[0].id : null;

	const options = {
		defaultSortingColumnKey: 'id',
		defaultSortingDirection: 'asc',
	};

	const columnDefs = [
		{
			headerName: 'TD Quote ID',
			field: 'id',
			sortable: true,
			cellRenderer: (props) => {
				return (
					<div>
						<a
							className='cmp-grid-url-underlined'
							href={`${window.location.origin + componentProp.quoteDetailUrl}?id=${props.value}`}
						>
							{props.value}
						</a>
					</div>
				);
			},
		},
		{
			headerName: 'Quote Reference',
			field: 'quoteReference',
			sortable: false,
			cellRenderer: (props) => {
				return (
					<div>
						<a className='cmp-grid-url-not-underlined'>{props.value}</a>
					</div>
				);
			},
		},
		{
			headerName: 'Vendor',
			field: 'vendor',
			sortable: false,
		},
		{
			headerName: 'End User Name',
			field: 'endUserName',
			sortable: false,
		},
		{
			headerName: 'SPA/Deal IDs',
			field: 'deals',
			sortable: false,
			valueFormatter: (props) => {
				return getDealsIdLabel(props.value);
			},
		},
		{
			headerName: 'Created',
			field: 'created',
			sortable: true,
			valueFormatter: (props) => {
				return getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Expires',
			field: 'expires',
			sortable: false,
			valueFormatter: (props) => {
				return getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Quote Value',
			field: 'quoteValue',
			sortable: true,
			valueFormatter: (props) => {
				return props.data.currencySymbol + props.value;
			},
		},
		{
			headerName: 'Checkout',
			field: 'canCheckOut',
			sortable: false,
			cellRenderer: (props) => {
				return (
					<div className='cmp-quotes-grid-checkout-icon'>
						{props.value ? <i className='fas fa-shopping-cart'></i> : <div></div>}
					</div>
				);
			},
		},
	];

	return (
		<section>
			<div className='cmp-quotes-grid'>
				<SearchCriteria
					Filters={QuotesGridSearch}
					componentProp={componentProp.searchCriteria ?? { title: 'Filter Quotes' }}
					onSearchRequest={filteringExtension.onQueryChanged}
					onClearRequest={filteringExtension.onQueryChanged}
				></SearchCriteria>
				<Grid
					columnDefinition={columnDefs}
					options={options}
					config={componentProp}
					onAfterGridInit={(config) => filteringExtension.onAfterGridInit(config)}
					requestInterceptor={(request) => filteringExtension.requestInterceptor(request)}
				></Grid>
			</div>
		</section>
	);
}

export default QuotesGrid;
