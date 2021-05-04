import React from 'react';
import Grid from '../Grid/Grid';

function OrdersGrid(props) {
	const componentProp = JSON.parse(props.componentProp);

	function getDateTransformed(dateUTC) {
		const formatedDate = new Date(dateUTC).toLocaleDateString();
		return formatedDate;
	}

	const columnDefs = [
		{
			headerName: 'Order #',
			field: 'orderId',
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
			headerName: 'Order Date',
			field: 'orderDate',
			sortable: false,
			valueFormatter: (props) => {
				return getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Reseller PO#',
			field: 'resellerPO',
			sortable: false,
		},
		{
			headerName: 'Ship To',
			field: 'shipTo',
			sortable: true,
		},
		{
			headerName: 'Order Type',
			field: 'orderType',
			sortable: false,
		},
		{
			headerName: 'Order Value',
			field: 'orderValue',
			sortable: true,
			valueFormatter: (props) => {
				return getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Invoice #',
			field: 'invoiceNum',
			sortable: true,
			valueFormatter: (props) => {
				return getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Status',
			field: 'status',
			sortable: true,
			cellRenderer: (props) => {
				return (
					<div className='cmp-quotes-grid-checkout-icon'>
						{props.value ? <p><i className='fas fa-check'></i> Shipped</p> : <p><i className='fas fa-ban'></i> Canceled</p>}
					</div>
				);
			},
		},
		{
			headerName: 'Track',
			field: 'track',
			sortable: false,
			cellRenderer: (props) => {
				return (
					<div className='cmp-quotes-grid-checkout-icon'>
						{props.value ? <i className='fas fa-truck'></i> : <div></div>}
					</div>
				);
			},
		},
		{
			headerName: 'Returns',
			field: 'returns',
			sortable: false,
			cellRenderer: (props) => {
				return (
					<div className='cmp-quotes-grid-checkout-icon'>
						{props.value ? <i className='fas fa-box-open'></i> : <div></div>}
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

export default OrdersGrid;
