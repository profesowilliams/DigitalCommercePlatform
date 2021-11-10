import React, { useState, useEffect } from 'react';
import Grid from '../Grid/Grid';
import GridSearchCriteria from '../Grid/GridSearchCriteria';
import Modal from '../Modal/Modal';
import DetailsInfo from '../DetailsInfo/DetailsInfo';
import useGridFiltering from '../../hooks/useGridFiltering';
import OrdersGridSearch from './OrdersGridSearch';
import { requestFileBlob } from '../../../../utils/utils';
import TrackOrderModal, {getTrackingModalTitle} from './TrackOrderModal/TrackOrderModal';



function OrdersGrid(props) {
    
    const componentProp = JSON.parse(props.componentProp);
    const filteringExtension = useGridFiltering();

    const [expandedOpenOrderFilter, setExpandedOpenOrderFilter] = useState(true);
    const [orderReportStatus, setOrderReportStatus] = useState(false);

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
        { iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Shipped' },
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

    const pendingValue = componentProp.pendingValue ? componentProp.pendingValue : 'Pending' ;

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

    //Please do not change the below method without consulting your Dev Lead
    function invokeModal(modal) {
        setModal(modal);
    }

    function applyStatusIcon(statusKey) {
        const compareStatusKey = (status) => status.iconKey.toLowerCase() === statusKey.toLowerCase();

        let icon = componentProp.iconList?.find(compareStatusKey);
        if (!icon) icon = defaultIcons.find(compareStatusKey);

        return icon;
    }

    function getDateTransformed(dateUTC) {
        const formatedDate = new Date(dateUTC).toLocaleDateString();
        return formatedDate;
    }

    function getTrackingStatus(trackingArray) {
        return trackingArray.length ? trackingArray.length > 0 : false;
    }

    const downloadFileBlob = async (orderId) => {
        try {
            const downloadOrderInvoicesUrl = componentProp.downloadAllInvoicesEndpoint?.replace("{order-id}", orderId);
            const name =  `order-${orderId}-invoices.zip`;
            await requestFileBlob(downloadOrderInvoicesUrl, name);
        } catch (error) {
            console.error('Error', error);
            setModal((previousInfo) => (
                {
                    ...previousInfo,
                    errorMessage: componentProp.invoicesModal?.errorMessage
                }
            ));
        }
    }


    function downloadAllInvoice(orderId) {
        return async () => {
            downloadFileBlob(orderId);
        }
    }
    function openInvoicePdf(orderId,url) {
        const singleDownloadUrl = url?.replace("{order-id}", orderId).replace(/(.*?)&.*/g,'$1');
        requestFileBlob(singleDownloadUrl,'',{redirect:true});
    }

    function getInvoices(line) {
        const url = componentProp.downloadAllInvoicesEndpoint;
        if (line.invoices.length && line.invoices.length > 1) {
            return (
                <div onClick={() => invokeModal({
                    content: (
                        <DetailsInfo
                            info={invoicesModal.content}
                            line={line}
                            pendingInfo={invoicesModal.pendingInfo}
                            pendingLabel={labelList.find((label) => label.labelKey === 'pending').labelValue}
                            pendingValue={pendingValue}
                            downloadInvoiceFunction={async (id)=> openInvoicePdf(id,url)}
                        ></DetailsInfo>
                    ),
                    properties: {
                        title: `${invoicesModal.title}: ${line.id} `,
                        buttonIcon: invoicesModal.buttonIcon,
                        buttonLabel: invoicesModal.buttonLabel,
                    },
                    modalAction: downloadAllInvoice(line.id)
                })}>
                    <div className='cmp-grid-url-underlined'>
                        {labelList.find((label) => label.labelKey === 'multiple').labelValue}
                    </div>
                </div>
            );
        } else {
            if (line.invoices[0]?.id === 'Pending') {
                return labelList.find((label) => label.labelKey === 'pending').labelValue;
              
            } else {
                return (<div className="cmp-grid-url-underlined" onClick={() => openInvoicePdf(line.invoices[0]?.id,url)}>
                    {line.invoices[0]?.id}
                </div>) ?? null;
            }
        }
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
            field: 'invoices',
            sortable: true,
            cellRenderer: (props) => getInvoices(props.data),
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
            cellRenderer: ({ node, api, setValue, data, value }) => {                
                return (
                    <div 
                    onClick={() => {
                        invokeModal({
                            content: ( 
                                <TrackOrderModal data={data} trackingConfig={componentProp.trackingConfig}></TrackOrderModal>
                            ),
                            properties: {
                                title: getTrackingModalTitle(componentProp.trackingConfig?.modalTitle, value),
                            }
                        });
                    }} className='icon'>{getTrackingStatus(value) ? <i className='fas fa-truck'></i> : <div></div>}</div>

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

    /**
	 * 
	 * @param {boolean} status 
	 */
	const filterOpenOrderReportsAction = (status, handleChange, onSearch, onClear) => {
		let query = '';
        if (status) { 
            query = '&status=OPEN';
        } else {
            query = '';
            
        }
        if (query==='') {
            onClear()
        } else {
            handleChange(query);
		    onSearch();
        }
	};


    /**
     * @param {Object} props
     * @param {boolean} props.expanded
     * @param {({query}) => void} props.handleChange
     * @param {() => void} props.onSearch
     * @returns 
     */
    const OptionButtons = ({expanded, handleChange, onSearch}) =>{
        
        return (
            <div className='cmp-search-criteria__header__button'>
                <div className='cmp-search-criteria__header__filter__title' 
                    onClick={() => {
                        if (expandedOpenOrderFilter) {
                            handleClickOptionsButton(false, handleChange, onSearch)    
                        }
                    }}
                >
                    <i className={`cmp-search-criteria__icon-button fas  fa-file-pdf`}></i>
                </div>
                <div className='cmp-search-criteria__header__filter__title'>
                    <i className={`cmp-search-criteria__icon-button fas fa-print`}></i>
                </div>
                
            </div>
        )
    };

    const handleClickOptionsButton = (expanded, handleChange, onSearch, onClear) => {
        
        setExpandedOpenOrderFilter(!expandedOpenOrderFilter);
        let value;
        if (expanded) {
            value = '';
        } else {
            value = !orderReportStatus;
        }
        setOrderReportStatus(value);
        filterOpenOrderReportsAction(value, handleChange, onSearch, onClear)
    }

	
  /**
   * @param {Object} props
   * @param {boolean} props.expanded
   * @param {({query}) => void} props.handleChange
   * @param {() => void} props.onSearch
   * @returns 
   */
	const ButtonOrderDetails = ({expanded, handleChange, onSearch, onClear}) => {
        if (expanded && !expandedOpenOrderFilter) {
            handleClickOptionsButton(true, handleChange, onSearch, onClear)
        }
        return (
            <div
                className={` ${expandedOpenOrderFilter || expanded ? 'hidden' : ''}`}
                onClick={() => {
                    handleClickOptionsButton(expanded, handleChange, onSearch, onClear)
                }}
            >
                <div className='cmp-search-criteria__header__filter'>
                    <div className='cmp-search-criteria__header__filter__title'>
                        Open Orders Report
                    </div>
                    <i className={`cmp-search-criteria__icon fas fa-times-circle`}></i>
                </div>
            </div>
        );
    };

    useEffect(() => {

    }, []);

    return (
        <section>
            <div className='cmp-orders-grid'>
                <GridSearchCriteria
                    Filters={OrdersGridSearch}
                    HeaderButtonOptions={OptionButtons}
                    ButtonsComponentHeader={ButtonOrderDetails}
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
            {modal && <Modal
                modalAction={modal.action}
                modalContent={modal.content}
                modalProperties={modal.properties}
                modalAction={modal.modalAction}
                actionErrorMessage={modal.errorMessage}
                onModalClosed={() => setModal(null)}
            ></Modal>}
        </section>
    );
}

export default OrdersGrid;
