import React from 'react';
import Grid from '../Grid/Grid';

function OrdersGrid(props) {
	const componentProp = JSON.parse(props.componentProp);

	const STATUS = {
		onHold: 'onHold',
		inProcess: 'inProcess',
		open: 'open',
		shipped: 'shipped',
		cancelled: 'cancelled',
	};

	const options = {
		defaultSortingColumnKey: 'id',
		defaultSortingDirection: 'asc',
	};

	const defaultIcons = [
		{ iconKey: STATUS.onHold, iconValue: 'fas fa-hand-paper', iconText: 'On Hold' },
		{ iconKey: STATUS.inProcess, iconValue: 'fas fa-dolly', iconText: 'In Process' },
		{ iconKey: STATUS.open, iconValue: 'fas fa-box-open', iconText: 'Open' },
		{ iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Shipped' },
		{ iconKey: STATUS.cancelled, iconValue: 'fas fa-ban', iconText: 'Cancelled' },
	];

	function applyStatusIcon(statusKey) {
		let icon = componentProp.iconList?.find((icon) => icon.iconKey === statusKey);
		if (!icon) icon = defaultIcons.find((icon) => icon.iconKey === statusKey);
		return icon;
	}

	function getDateTransformed(dateUTC) {
		const formatedDate = new Date(dateUTC).toLocaleDateString();
		return formatedDate;
	}

	function getTrackingStatus(trackingArray) {
		return trackingArray.length ? trackingArray.length > 0 : false;
	}

	function nullFormatter(value) {
		return value === null ? 'N/A' : value;
	}

	const columnDefs = [
		{
			headerName: 'Order #',
			field: 'id',
			sortable: true,
			cellRenderer: (props) => {
				return (
					<div>
						<a
							className='cmp-grid-url-underlined'
							href={`${window.location.origin + componentProp.orderDetailUrl}?id=${props.value}`}
						>
							{props.value}
						</a>
					</div>
				);
			},
		},
		{
			headerName: 'Order Date',
			field: 'created',
			sortable: true,
			valueFormatter: (props) => {
				return getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Reseller PO#',
			field: 'reseller',
			sortable: false,
		},
		{
			headerName: 'Vendor',
			field: 'vendor',
			sortable: false,
		},
		{
			headerName: 'Ship To',
			field: 'shipTo',
			sortable: true,
		},
		{
			headerName: 'Order Type',
			field: 'type',
			sortable: false,
		},
		{
			headerName: 'Order Value',
			field: 'priceFormatted',
			sortable: true,
			valueFormatter: (props) => {
				return props.data.currencySymbol + props.value;
			},
		},
		{
			headerName: 'Invoice #',
			field: 'invoice',
			sortable: true,
			cellRenderer: (props) => {
				return <div>{nullFormatter(props.value)}</div>;
			},
		},
		{
			headerName: 'Status',
			field: 'status',
			sortable: true,
			cellRenderer: (props) => {
				return (
					<span className='status'>
						<i className={`icon ${applyStatusIcon(props.value)?.iconValue}`}></i>
						<div className='text'>{applyStatusIcon(props.value)?.iconText}</div>
					</span>
				);
			},
		},
		{
			headerName: 'Track',
			field: 'trackings',
			sortable: false,
			cellRenderer: (props) => {
				return (
					<div className='icon'>{getTrackingStatus(props.value) ? <i className='fas fa-truck'></i> : <div></div>}</div>
				);
			},
		},
		{
			headerName: 'Returns',
			field: 'isReturn',
			sortable: false,
			cellRenderer: (props) => {
				return <div className='icon'>{props.value ? <i className='fas fa-box-open'></i> : <div></div>}</div>;
			},
		},
	];

	return (
		<section>
			<div className='cmp-orders-grid'>
				<Grid columnDefinition={columnDefs} options={options} config={componentProp}></Grid>
			</div>
		</section>
	);
}

export default OrdersGrid;
