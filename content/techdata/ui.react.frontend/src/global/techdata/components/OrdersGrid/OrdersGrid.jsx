import React, { useState, useRef } from 'react';
import GridComponent from '../Grid/Grid';
import GridSearchCriteria from '../Grid/GridSearchCriteria';
import Modal from '../Modal/Modal';
import DetailsInfo from '../DetailsInfo/DetailsInfo';
import useGridFiltering from '../../hooks/useGridFiltering';
import OrdersGridSearch from './OrdersGridSearch';
import { isNotEmptyValue, requestFileBlob } from '../../../../utils/utils';
import TrackOrderModal, {getTrackingModalTitle} from './TrackOrderModal/TrackOrderModal';
import { hasAccess, ACCESS_TYPES } from '../../../../utils/user-utils';
import {
    ADOBE_DATA_LAYER_ORDERS_GRID_CLICKINFO_CATEGORY,
    ADOBE_DATA_LAYER_ORDERS_GRID_SEARCH_EVENT,
    ERROR_LOGIN_MESSAGE,
    LOCAL_STORAGE_KEY_USER_DATA
} from '../../../../utils/constants';
import { pushEventAnalyticsGlobal, pushEvent, ANALYTICS_TYPES } from '../../../../utils/dataLayerUtils';
import OpenFilter from '../Widgets/OpenFilter';
import ButtonLabelFilter from '../Widgets/ButtonLabelFilter';

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
    const errorLoginMessage = componentProp.errorLoginMessage ? componentProp.errorLoginMessage : ERROR_LOGIN_MESSAGE;
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

    const modalPDFErrorHandler = (title = '', error = '') => {
        setModal((previousInfo) => ({
            content: (
                <div className="cmp-quote-error-modal">{error}</div>
            ),
            properties: {
                title:  title,
                
            },
            ...previousInfo,
          }));
       
    };

    const downloadFileBlob = async (orderId) => {
        try {
            const downloadOrderInvoicesUrl = componentProp.downloadAllInvoicesEndpoint?.replace("{order-id}", orderId);
            const name =  `order-${orderId}-invoices.zip`;
            await requestFileBlob(downloadOrderInvoicesUrl, name, {redirect:false}, modalPDFErrorHandler);
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

    async function openInvoicePdf(invoiceId,orderId) {
        const url = componentProp.downloadAllInvoicesEndpoint || 'nourl';
        const singleDownloadUrl = url?.replace("{order-id}", orderId).replace(/(.*?)&.*/g,'$1');
        const invoiceUrl = `${singleDownloadUrl}&invoiceId=${invoiceId}`;
        await requestFileBlob(invoiceUrl,'',{redirect:true}, modalPDFErrorHandler);
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
                            downloadInvoiceFunction={async (id, orderId)=> await openInvoicePdf(id,orderId)}
                        ></DetailsInfo>
                    ),
                    properties: {
                        title: `${invoicesModal.title}: ${line.id} `,
                        buttonIcon: invoicesModal.buttonIcon,
                        buttonLabel: invoicesModal.buttonLabel,
                    },
                    modalAction: downloadAllInvoice(line.id)
                })}>
                    <div className='cmp-grid-url-underlined' onClick={() => addOrderGridTracking(ANALYTICS_TYPES.events.click, ANALYTICS_TYPES.types.link, ANALYTICS_TYPES.category.orderTableInteractions, ANALYTICS_TYPES.name.invoice)}>
                        {labelList.find((label) => label.labelKey === 'multiple').labelValue}
                    </div>
                </div>
            );
        } else {
            if (invoices && invoices[0]?.id === 'Pending') {
                return labelList.find((label) => label.labelKey === 'pending').labelValue;
            } else {
              const invoiceId = typeof invoices === 'string'
                ? invoices
                : invoices && invoices.length
                  ? invoices[0]?.id
                  : invoices;

                if (invoices && invoices.length) {
                    setValueParam(invoiceId); // set the value of the single invoice and this permit copy the value
                    // not is necessary in the multiples or pending values because that overwrite the value for a string
                }
              return (
                <div className="cmp-grid-url-underlined" onClick={async () => {
                      addOrderGridTracking(ANALYTICS_TYPES.events.click, ANALYTICS_TYPES.types.link, ANALYTICS_TYPES.category.orderTableInteractions, ANALYTICS_TYPES.name.invoice);
                      await openInvoicePdf(invoiceId, line.id)
                }}>
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
            return; // forcing the return if the object is empty
        }
        const order = {
            searchTerm: analyticObjectParam.searchTerm,
            searchOption: analyticObjectParam.searchOption,
            method: analyticObjectParam.method,
            fromDate: analyticObjectParam.fromDate,
            toDate: analyticObjectParam.toDate,
            vendorFilter: analyticObjectParam.vendorFilter,
            nullSearch: !isNotEmptyValue(responseLength) // when the UI/service not found a row return a null value, so if the result is empty then this value is true, else false
        };
        const objectToSend = {
          event: ADOBE_DATA_LAYER_ORDERS_GRID_SEARCH_EVENT,
          order,
        };
        pushEventAnalyticsGlobal(objectToSend);
    };
    
    const addOrderGridTracking = (event, type, category, name) =>
        pushEvent(event, {
            type,
            category,
            name,
        });

    const columnDefs = [
        {
            headerName: 'Order #',
            field: 'id',
            sortable: true,
            cellRenderer: (props) => {
                return (
                    <div>
                        <a
                            onClick={() => addOrderGridTracking(ANALYTICS_TYPES.events.click, ANALYTICS_TYPES.types.link, ANALYTICS_TYPES.category.orderTableInteractions, ANALYTICS_TYPES.name.orderID)}
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
                        addOrderGridTracking(ANALYTICS_TYPES.events.click, ANALYTICS_TYPES.types.link, ANALYTICS_TYPES.category.orderTableInteractions, ANALYTICS_TYPES.name.trackAnOrder)
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
     * @param {boolean} expanded 
     * @param {() => void} handleChange 
     * @param {() => void} onSearch 
     * @param {() => void} onClear 
     */
    const handleClickOptionsButton = (expanded = false, handleChange, onSearch, onClear) => {
        let value = expanded ? '' : !orderReportStatus;
        setExpandedOpenOrderFilter(!expandedOpenOrderFilter);
        
        setOrderReportStatus(value);
        filterOpenOrderReportsAction(value, handleChange, onSearch, onClear);
    };

    /**
     * 
     * @param {boolean} status 
     * @param {(string) => void} handleChange 
     * @param {() => void} onSearch 
     * @param {() => void} onClear 
     */
     const filterOpenOrderReportsAction = (status, handleChange, onSearch, onClear) => {
        const query = status ? '&status=OPEN' : '';
        if (query === '') {
            onClear();
        } else {
            handleChange(query);
            onSearch();
        }
    };    

    async function handleRequestInterceptor(request) {
        const response = await filteringExtension.requestInterceptor(request);
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
            return response;
        }
    }
    
    const handleOnSearchRequest = (query) => {
        const queryStringId = query.queryString.split("&").filter(item => item.includes("id="));

        if (queryStringId && queryStringId.length > 0) {
            const id = queryStringId[0].split("=")[1];

            if (id && id.trim().length > 0) {
                filteredOrderId.current = id;
            }
        }
        filteringExtension.onQueryChanged(query);
        analyticModel.current = query.analyticsData;
    };

    /**
     * handler execute the clear event and
     * add analytic events and manage the correct way
     * @param {any} query 
     * @param {any} options 
     */
    const handlerOnClearEvent = (query, options = { filterStrategy: 'get' }) => {
        analyticModel.current = null; // forcing the null value to not enter into the analytic funtion again
        filteringExtension.onQueryChanged(query, options);
    };

    if(HAS_ORDER_ACCESS) {
      return (
        <section>
            <div className='cmp-orders-grid'>
                <GridSearchCriteria
                    Filters={OrdersGridSearch}
                    HeaderButtonOptions={OpenFilter}
                    ButtonsComponentHeader={ButtonLabelFilter}
                    labelFilterGrid={labelFilterGrid}
                    label={componentProp.searchCriteria?.title ?? 'Filter Orders'}
                    componentProp={componentProp.searchCriteria}
                    onSearchRequest={handleOnSearchRequest}
                    onClearRequest={handlerOnClearEvent}
                    uiServiceEndPoint={uiServiceEndPoint}
                    category={ADOBE_DATA_LAYER_ORDERS_GRID_CLICKINFO_CATEGORY}
                    handleClickOptionsButton={handleClickOptionsButton}
                    flagOpenOrder={expandedOpenOrderFilter}
                ></GridSearchCriteria>
                <Grid
                    columnDefinition={columnDefs}
                    options={options}
                    config={componentProp}
                    onAfterGridInit={(config) => filteringExtension.onAfterGridInit(config)}
                    requestInterceptor={handleRequestInterceptor}
                ></Grid>
            </div>
            {modal && <Modal
                modalAction={modal.action}
                modalContent={modal.content}
                modalProperties={modal.properties}
                actionErrorMessage={modal.errorMessage}
                onModalClosed={() => setModal(null)}
            ></Modal>}
        </section>
    );
    } else {
        return (
          <div className="cmp-error">
            <div className="cmp-error__header">
              {errorLoginMessage}
            </div>
          </div>
        );
    }
}

export default OrdersGrid;
