import React, { useState, useRef, useEffect } from 'react';
import GridComponent from '../Grid/Grid';
import GridSearchCriteria from '../Grid/GridSearchCriteria';
import Modal from '../Modal/Modal';
import DetailsInfo from '../DetailsInfo/DetailsInfo';
import useGridFiltering from '../../hooks/useGridFiltering';
import OrdersGridSearch from './OrdersGridSearch';
import { isNotEmptyValue, requestFileBlob } from '../../../../utils/utils';
import TrackOrderModal, {getTrackingModalTitle} from './TrackOrderModal/TrackOrderModal';
import { usePreservedStore } from '../../hooks/usePreservedStore';
import { hasAccess, ACCESS_TYPES } from '../../../../utils/user-utils';
import {
    ADOBE_DATA_LAYER_ORDERS_GRID_CLICKINFO_CATEGORY,
    ADOBE_DATA_LAYER_ORDERS_GRID_SEARCH_EVENT,
    LOCAL_STORAGE_KEY_USER_DATA
} from '../../../../utils/constants';
import { pushEventAnalyticsGlobal, pushEvent } from '../../../../utils/dataLayerUtils';

const Grid = React.memo(GridComponent);

const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));

function OrdersGrid(props) {
    const componentProp = JSON.parse(props.componentProp);
    const filteringExtension = useGridFiltering();
    const labelFilterGrid = componentProp.searchCriteria?.labelButtonFilter ? componentProp.searchCriteria.labelButtonFilter : "Open Orders Report";
    const [expandedOpenOrderFilter, setExpandedOpenOrderFilter] = useState(true);
    const [orderReportStatus, setOrderReportStatus] = useState(false);
    const showMoreFlag = componentProp.showMoreFlag ? componentProp.showMoreFlag : false;
    const [modal, setModal] = useState(null);
    const HAS_ORDER_ACCESS = hasAccess({user: USER_DATA, accessType: ACCESS_TYPES.CAN_VIEW_ORDERS});
    const uiServiceEndPoint = componentProp.uiServiceEndPoint ? componentProp.uiServiceEndPoint : ''; 
    const filteredOrderId = useRef(null);
    const STATUS = {
        salesReview: 'salesreview',
        inProcess: 'inprocess',
        open: 'open',
        shipped: 'shipped',
        cancelled: 'cancelled',
    };

    const options = {
        defaultSortingColumnKey: 'id',
        defaultSortingDirection: 'asc',
    };

    const defaultIcons = [
         { iconKey: STATUS.inProcess, iconValue: 'fas fa-dolly', iconText: 'In Process' },
        { iconKey: STATUS.open, iconValue: 'fas fa-box-open', iconText: 'Open' },
        { iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Shipped' },
        { iconKey: STATUS.cancelled, iconValue: 'fas fa-ban', iconText: 'Cancelled' },
        { iconKey: STATUS.salesReview, iconValue: '', iconText: 'In Review' },
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

    const trackingModal = {
        title: componentProp.trackingsModal?.title ?? 'Order',
        // buttonLabel: componentProp.trackingsModal?.buttonLabel ?? 'Download All Related Trackings',
        buttonIcon: componentProp.trackingsModal?.buttonIcon ?? 'fas fa-download',
        content:
            componentProp.trackingsModal?.content ??
            'There are multiple Trackings associated with this Order. Click an tracking number to preview with the option to print',
        pendingInfo:
            componentProp.trackingsModal?.pendingInfo ?? 'Tracking is pending and will appear here after shipment is processed',
    };

    const analyticModel = useRef(null);

    //Please do not change the below method without consulting your Dev Lead
    function invokeModal(modal) {
        setModal(modal);
    }

    function applyStatusIcon(statusKey) {
      let icon = componentProp.iconList?.find((status) => status.iconKey.toLowerCase() === statusKey.replace(/\s+/g, '').toLowerCase());
      return icon
        ? icon
        : defaultIcons.find((status) => status?.iconKey?.toLowerCase() === statusKey.replace(/\s+/g, '').toLowerCase());
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
    };

    function downloadAllInvoice(orderId) {
        return async () => {
            downloadFileBlob(orderId);
        }
    }
    function openInvoicePdf(invoiceId,orderId) {
        const url = componentProp.downloadAllInvoicesEndpoint || 'nourl';
        const singleDownloadUrl = url?.replace("{order-id}", orderId).replace(/(.*?)&.*/g,'$1');
        const invoiceUrl = `${singleDownloadUrl}&invoiceId=${invoiceId}`;
        requestFileBlob(invoiceUrl,'',{redirect:true});
    }
    
    /**
     * Function that return a JSX component with the values and actions to open
     * the PDF files of an a single invoice or a multiples invioces
     * @param {any[]} invoices 
     * @param {React.Dispatch<React.SetStateAction<any>>} setValueParam 
     * @param {any} line 
     * @returns 
     */
    const getInvoices = (invoices, setValueParam, line) => {
        const url = componentProp.downloadAllInvoicesEndpoint;
        if (typeof invoices !== 'string' && invoices?.length && invoices.length > 1) {
            return (
                <div onClick={() => invokeModal({
                    content: (
                        <DetailsInfo
                            info={invoicesModal.content}
                            line={line}
                            pendingInfo={invoicesModal.pendingInfo}
                            pendingLabel={labelList.find((label) => label.labelKey === 'pending').labelValue}
                            pendingValue={pendingValue}
                            downloadInvoiceFunction={async (id, orderId)=> openInvoicePdf(id,orderId)}
                        ></DetailsInfo>
                    ),
                    properties: {
                        title: `${invoicesModal.title}: ${line.id} `,
                        buttonIcon: invoicesModal.buttonIcon,
                        buttonLabel: invoicesModal.buttonLabel,
                    },
                    modalAction: downloadAllInvoice(line.id)
                })}>
                    <div className='cmp-grid-url-underlined' onClick={() => addOrderGridTracking('click', 'link', 'Orders Table Interactions', 'Invoice')}>
                        {labelList.find((label) => label.labelKey === 'multiple').labelValue}
                    </div>
                </div>
            );
        } else {
            if (invoices && invoices[0]?.id === 'Pending') {
                return labelList.find((label) => label.labelKey === 'pending').labelValue;
            } else {
                const invoiceId = typeof invoices === 'string' ? invoices :
                    invoices && invoices.length ? invoices[0]?.id : invoices;

                if (invoices && invoices.length) {
                    setValueParam(invoiceId); // set the value of the single invoice and this permit copy the value
                    // not is necessary in the multiples or pending values because that overwrite the value for a string
                }
                return (<div className="cmp-grid-url-underlined" onClick={() => {addOrderGridTracking('click', 'link', 'Orders Table Interactions', 'Invoice'); openInvoicePdf(invoiceId, line.id)}}>
                    {invoiceId}
                </div>) ?? null;
            }
        }
    };

    /**
     * 
     * @param {any} analyticObjectParam 
     * @param {number} responseLength 
     */
    const handleFilterComponent = (analyticObjectParam, responseLength) => {
        if  (!isNotEmptyValue(analyticObjectParam)) {
            return // forcing the return if the object is empty
        }

        const quotes = {
            vendorFilter: analyticObjectParam.vendorFilter
        };
        const order = {
            searchTerm: analyticObjectParam.searchTerm,
            searchOption: analyticObjectParam.searchOption ,
            license: analyticObjectParam.license ,
            method: analyticObjectParam.method ,
            fromDate: analyticObjectParam.fromDate ,
            toDate: analyticObjectParam.toDate ,
            nullSearch: isNotEmptyValue(responseLength) // when the UI/service not found a row return a null value, so if the result is empty then this value is true, else false
        };
        const objectToSend = {
          event: ADOBE_DATA_LAYER_ORDERS_GRID_SEARCH_EVENT,
          order,
          quotes,
        };
        pushEventAnalyticsGlobal(objectToSend);
    };
    
    const addOrderGridTracking = (event, type, category, name) => {
        pushEvent(event, 
            {
                type,
                category,
                name,
            })
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
                            onClick={() => addOrderGridTracking('click', 'link', 'Orders Table Interactions', 'Order ID')}
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
            cellRenderer: ({ node, api, setValue, data, value }) => getInvoices(value, setValue, data),
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
                        addOrderGridTracking('click', 'link', 'Orders Table Interactions', 'Track an Order')
                        invokeModal({
                            content: ( 
                                <TrackOrderModal 
                                    data={data}
                                    info={trackingModal.content}
                                    trackingConfig={componentProp.trackingConfig}
                                    pendingInfo={trackingModal.pendingInfo}
                                    showMoreFlag={showMoreFlag}
                                ></TrackOrderModal>
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
                    <i className={`cmp-search-criteria__icon-button fas  fa-box-open`} title='Select Open Orders'></i>
                </div>
                
                <div className='cmp-search-criteria__header__filter__title'>
                    <i className={`cmp-search-criteria__icon-button fas  fa-file-pdf`} title='Export to PDF' ></i>
                </div>
                <div className='cmp-search-criteria__header__filter__title'>
                    <i className={`cmp-search-criteria__icon-button fas fa-print`} title='Print'></i>
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
    };

	
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
                        {labelFilterGrid}
                    </div>
                    <i className={`cmp-search-criteria__icon fas fa-times-circle`}></i>
                </div>
            </div>
        );
    };

	function handleAfterGridInit(config) {
		columnApiRef.current = config.columnApi;
		filteringExtension.onAfterGridInit(config);
	}
	const columnApiRef = React.useRef();
    const hasToSortAgain = React.useRef(false);
   
    const { onSortChanged, sortPreservedState } = usePreservedStore(columnApiRef);

    async function handleRequestInterceptor(request) {
        // hasToSortAgain.current // I think this have somehting to have with the rerender
        const response = await filteringExtension.requestInterceptor(request)

        handleFilterComponent(
            analyticModel.current,
            response?.data?.content?.items?.length
        );

        if (filteredOrderId.current && (!response?.data?.content?.items || response?.data?.content?.items?.length === 0)) {
            const redirectUrl =
                componentProp.shopDomain + componentProp.legacyOrderDetailsUrl.replace("{order-id}", filteredOrderId.current);
            window.location.href = redirectUrl;
        }
        if (response?.data?.content?.items?.length === 1) {
            const detailsRow = response.data.content.items[0];
            const redirectUrl = `${window.location.origin + componentProp.orderDetailUrl}?id=${detailsRow.id}`;
            window.location.href = redirectUrl;
        } else {
            if (hasToSortAgain.current) {
                sortPreservedState();
                hasToSortAgain.current = false;
            }
            return response;
        }
    }
    
    const handleOnSearchRequest = (query) => {
        const queryStringId = query.queryString.split("&").filter(item => item.includes("id="));

        if(queryStringId && queryStringId.length > 0){
            const id = queryStringId[0].split("=")[1];

            if(id && id.trim().length > 0){
                filteredOrderId.current = id;
            }
        }
        filteringExtension.onQueryChanged(query);
        analyticModel.current = query.analyticsData;
        hasToSortAgain.current = true
    };

  if(HAS_ORDER_ACCESS) {
    return (
        <section>
            <div className='cmp-orders-grid'>
                <GridSearchCriteria
                    Filters={OrdersGridSearch}
                    HeaderButtonOptions={OptionButtons}
                    ButtonsComponentHeader={ButtonOrderDetails}
                    label={componentProp.searchCriteria?.title ?? 'Filter Orders'}
                    componentProp={componentProp.searchCriteria}
                    onSearchRequest={handleOnSearchRequest}
                    onClearRequest={filteringExtension.onQueryChanged}
                    uiServiceEndPoint={uiServiceEndPoint}
                    category={ADOBE_DATA_LAYER_ORDERS_GRID_CLICKINFO_CATEGORY}
                ></GridSearchCriteria>
                <Grid
                    columnDefinition={columnDefs}
                    options={options}
                    config={componentProp}
                    onAfterGridInit={handleAfterGridInit}
					onSortChanged={onSortChanged}
                    requestInterceptor={handleRequestInterceptor}
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
  } else {
    return (
        <div className="cmp-error">
        <div className="cmp-error__header">
          You do not have the required entitlement to access this information
        </div>
        </div>
    )
  }
}

export default OrdersGrid;
