import React from 'react';
import Grid from '../Grid/Grid';

function QuotesGrid(props) {
	const componentProp = JSON.parse(props.componentProp);

	function getDateTransformed(dateUTC) {
		const formatedDate = new Date(dateUTC).toLocaleDateString();
		return formatedDate;
	}

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
							href={`${window.location.origin + componentProp.quoteDetailUrl}?quoteId=${props.value}`}
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
			sortable: true,
		},
		{
			headerName: 'SPA/Deal IDs',
			field: 'dealId',
			sortable: false,
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
			sortable: true,
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
				<Grid columnDefinition={columnDefs} config={componentProp}></Grid>
			</div>
		</section>
	);
}

export default QuotesGrid;
