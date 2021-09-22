import React, { useState, useRef } from 'react';
import axios from "axios";
import Grid from '../Grid/Grid';
import GridSearchCriteria from '../Grid/GridSearchCriteria';
import Modal from '../Modal/Modal';
import DetailsInfo from '../DetailsInfo/DetailsInfo';
import useGridFiltering from '../../hooks/useGridFiltering';
import OrdersGridSearch from './OrdersGridSearch';

function OrdersGrid(props) {
	const componentProp = 
		typeof props.componentProp === 'string' 
			? JSON.parse(props.componentProp) : props.componentProp;

	const filteringExtension = useGridFiltering();
	const [modal, setModal] = useState(null);
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
		{ iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Digital Download / Emailed' },
		{ iconKey: STATUS.cancelled, iconValue: 'fas fa-ban', iconText: 'Cancelled' },
	];

	const labelList = [
		{
			labelKey: 'multiple',
			labelValue: componentProp.labelList?.find((label) => label.labelKey === 'multiple')?.labelValue ?? 'Multiple',
		},
		{
			labelKey: 'pending',
			labelValue: componentProp.labelList?.find((label) => label.labelKey === 'pending')?.labelValue ?? 'Pending',
		},
	];
	const invoicesModal = {
		title: componentProp.invoicesModal?.title ?? 'Order',
		buttonLabel: componentProp.invoicesModal?.buttonLabel ?? 'Download All Related Invoices',
		buttonIcon: componentProp.invoicesModal?.buttonIcon ?? 'fas fa-download',
		content:
			componentProp.invoicesModal?.content ??
			'There are multiple Invoices associated with this Order. Click an invoice number to preview with the option to print or Download All for a zip file of all shown here',
		pendingInfo:
			componentProp.invoicesModal?.pendingInfo ?? 'Invoice is pending and will appear here after shipment is processed',
	};

	function invokeModal(modal) {
		setModal(
			<Modal
				modalAction={modal.action}
				modalContent={modal.content}
				modalProperties={modal.properties}
				onModalClosed={() => setModal(null)}
			></Modal>
		);
	}

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

	function getInvoices(line) {
		if (line.invoices.length && line.invoices.length > 1) {
			return (
				<div
					onClick={() => {
						invokeModal({
							content: (
								<DetailsInfo
									info={invoicesModal.content}
									line={line}
									pendingInfo={invoicesModal.pendingInfo}
									pendingLabel={labelList.find((label) => label.labelKey === 'pending').labelValue}
								></DetailsInfo>
							),
							properties: {
								title: `${invoicesModal.title}: ${line.id} `,
								buttonIcon: invoicesModal.buttonIcon,
								buttonLabel: invoicesModal.buttonLabel,
							},
						});
					}}
				>
					{labelList.find((label) => label.labelKey === 'multiple').labelValue}
				</div>
			);
		} else {
			if (line.invoices[0]?.id === 'Pending') {
				return labelList.find((label) => label.labelKey === 'pending').labelValue;
			} else {
				return line.invoices[0]?.id ?? null;
			}
		}
	}

	const columnDefs = [
		{
			headerName: 'Line',
			field: 'id',
			sortable: true,
		},
		{
			headerName: 'Mfr No',
			field: 'manufacturer',
			sortable: false,
		},
		
		{
			headerName: 'Ref No',
			field: 'reseller',
			sortable: false,
		},
		{
			headerName: 'Description',
			field: 'description',
			sortable: true,
			cellRenderer: (props) => {
				return (
					<div>
						<a
							target="_blank"
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
			headerName: 'Quantity',
			field: 'quantity',
			sortable: false,
		},
		{
			headerName: 'Unit Price(USD)',
			field: 'unitPrice',
			sortable: false,
		},
		{
			headerName: 'Total Pricce(USD)',
			field: 'totalPrice',
			sortable: false,
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
			headerName: 'Ship Date',
			field: 'shipDate',
			sortable: true,
			valueFormatter: (props) => {
				return typeof props.value === 'string' ? props.value : getDateTransformed(props.value);
			},
		},
		{
			headerName: 'Serial',
			field: 'serial',
			sortable: true,
			cellRenderer: (props) => {
				return (
					<div>
						{props.value === 'View' ? (
							<a
								target="_blank"
								className='cmp-grid-url-underlined'
								href={`${window.location.origin + componentProp.orderDetailUrl}?id=${props.value}`}
							>
								{props.value}
							</a>
						) : (
							<div>
								{props.value}
							</div>
						)}
						
					</div>
				)
			},
		},
		{
			headerName: 'Invoice #',
			field: 'invoices',
			sortable: true,
			cellRenderer: (props) => {
				return <div className='cmp-grid-url-underlined'>{getInvoices(props.data)}</div>;
			},
		},
	];

	return (
		<section>
			<div className='cmp-orders-grid'>
				<GridSearchCriteria
					Filters={OrdersGridSearch}
					label={componentProp.searchCriteria?.title ?? 'Filter Orders'}
					componentProp={componentProp.searchCriteria}
					onSearchRequest={filteringExtension.onQueryChanged}
					onClearRequest={filteringExtension.onQueryChanged}
				></GridSearchCriteria>
				<Grid
					columnDefinition={columnDefs}
					options={options}
					config={componentProp}
					onAfterGridInit={(config) => filteringExtension.onAfterGridInit(config)}
					requestInterceptor={(request) => filteringExtension.requestInterceptor(request)}
				></Grid>
			</div>
			{modal}
		</section>
	);
}

export default OrdersGrid;
