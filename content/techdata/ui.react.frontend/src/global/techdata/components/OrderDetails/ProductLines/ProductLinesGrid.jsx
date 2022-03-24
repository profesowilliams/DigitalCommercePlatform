import React, { useEffect, useState } from "react";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesMarkupGlobal from "./ProductLinesMarkupGlobal";
import ProductLinesMarkupRow from "./ProductLinesMarkupRow";
import TrackOrderModal, {getTrackingModalTitle} from "../../OrdersGrid/TrackOrderModal/TrackOrderModal";
import useGridFiltering from "../../../hooks/useGridFiltering";
import OrderDetailsSearch from "../OrderDetailsGridSearch/OrderDetailsGridSearch";
import GridSearchCriteria from "../../Grid/GridSearchCriteria";
import { thousandSeparator } from "../../../helpers/formatting";
import Modal from "../../Modal/Modal";
import OrderDetailsSerialNumbers from "../OrderDetailsSerialNumbers/OrderDetailsSerialNumbers";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";
import { isNotEmptyValue, requestFileBlob } from "../../../../../utils/utils";
import { ANALYTICS_TYPES, pushEventAnalyticsGlobal } from "../../../../../utils/dataLayerUtils";

function ProductLinesGrid({
  gridProps,
  data,
  labels,
  quoteOption,
  onMarkupChanged,
  iconList,
  downloadInvoicesEndpoint,
}) {

  const [gridApi, setGridApi] = useState(null);
  const gridData = data.items ?? [];
  /**
   * @type {any[]}
   */
  const mutableGridData = Object.assign([], gridData);
  const [filterGridData, setfilterGridData] =  useState();
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [queryChange, setQuerychange] = useState('');
  const [modal, setModal] = useState(null);
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };
  const agGridLicenseKey = gridProps.agGridLicenseKey;
  const NO_SHIP_DATE_LABEL = gridConfig?.noShipDateLabel ? gridConfig.noShipDateLabel : 'No Ship Date'
  const filteringExtension = useGridFiltering();  
  const columnsList = gridConfig.columnList;
  const columnsArray = gridConfig.columnList;
  const showMoreFlag = gridProps.showMoreFlag ? gridProps.showMoreFlag : false;
  const STATUS = {
    onHold: 'onHold',
    inProcess: 'inProcess',
    open: 'open',
    shipped: 'shipped',
    cancelled: 'cancelled',
    salesreview: 'salesReview'
  };
  const defaultIcons = [
    { iconKey: STATUS.onHold, iconValue: 'fas fa-hand-paper', iconText: 'On Hold' },
    { iconKey: STATUS.inProcess, iconValue: 'fas fa-dolly', iconText: 'In Process' },
    { iconKey: STATUS.open, iconValue: 'fas fa-box-open', iconText: 'Open' },
    { iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Shipped' },
    { iconKey: STATUS.cancelled, iconValue: 'fas fa-ban', iconText: 'Cancelled' },
    { iconKey: STATUS.salesreview, iconValue: '', iconText: 'In Review' },
  ];
  const [flagData, setFlagData] = useState(false);
  
  const trackingModal = {
    title: gridConfig.trackingsModal?.title ?? 'Order',
    buttonIcon: gridConfig.trackingsModal?.buttonIcon ?? 'fas fa-download',
    pendingInfo: gridConfig.trackingsModal?.pendingInfo ?? 'Tracking is pending and will appear here after shipment is processed',
  };

  function invokeModal(modal) {
    setModal(modal);
  }

  function expandAll() {
    gridApi?.forEachNode((node) => {
      node.expanded = true;
    });
    handlerAnalyticCollapsedOrExpandAll(false);
    gridApi?.expandAll();
  }

  function collapseAll() {
    gridApi?.forEachNode((node) => {
      node.expanded = false;
    });
    handlerAnalyticCollapsedOrExpandAll(true);
    gridApi?.collapseAll();
  }

  function onAfterGridInit({ node, api, gridResetRequest }) {
    setGridApi(api);
  }

  function markupChanged(data) {
    if (typeof onMarkupChanged === "function") {
      onMarkupChanged(data);
    }
  }

  function applyStatusIcon(statusKey) {
    let icon = iconList?.find((icon) => icon.iconKey.toLowerCase() === statusKey.replace(/\s+/g, '').toLowerCase());
    return icon
      ? icon
      : defaultIcons.find((icon) => icon.iconKey.toLowerCase() === statusKey.replace(/\s+/g, '').toLowerCase());
  }

  function getDateTransformed(dateUTC) {
    const formattedDate = new Date(dateUTC).toLocaleDateString();
    return formattedDate;
  }

  function getShipDateFromTracking(trackingObject)
  {
    const firstShipDateValue = trackingObject.shipDates !== undefined && trackingObject.shipDates.length > 0 ? trackingObject.shipDates[0] : '*';
    return getDateTransformed(firstShipDateValue)
  }

  function getTrackingStatus(trackingArray) {
    return trackingArray.length ? trackingArray.length > 0 : false;
  }

  /**
   * 
   * @param {string} invoiceId 
   * @param {string} orderId 
   */
  function openInvoicePdf(invoiceId, orderId) {
    const url = downloadInvoicesEndpoint || 'nourl';
    const singleDownloadUrl = url?.replace("{order-id}", orderId).replace(/(.*?)&.*/g,'$1');
    const invoiceUrl = `${singleDownloadUrl}&invoiceId=${invoiceId}`;
    requestFileBlob(invoiceUrl,'',{redirect:true});
  }

  const handlerInvoiceClick = (lineData) => {
    handlerAnalyticInvoiceClick(lineData)
    openInvoicePdf(lineData.invoices[0]?.id, data?.orderNumber);
  };

  /**
   * handler that validate if a row in OrderDetails have a
   * children that can expand and show a chevrons
   * @param {any} dataItem 
   * @returns 
   */
  const handlerIsRowMaster = (dataItem) => {
    return dataItem ? dataItem?.children?.length > 0 : false;
  };

  //default column defs
  const columnDefs = [
    {
      headerName:  "Line Item",
      field:  "displayLineNumber",
      sortable: false,
      expandable: true,
      rowClass: ({ node, data }) => {
        return `${
          !data?.children || data.children.length === 0
              ? "`cmp-product-lines-grid__row`"
              : ""
        }`
      },
      cellClass: ({ node, data }) => {
        return `${
          !data?.children || data.children.length === 0
              ? "cmp-product-lines-grid__row--notExpandable--orders"
              : ""
        }`
      },
      detailRenderer: ({ data }) => {
        return (
          <section className="cmp-product-lines-grid__row cmp-product-lines-grid__row--expanded">
            <ProductLinesChildGrid
                gridProps={gridProps}
                license={agGridLicenseKey}
                columnDefiniton={columnDefsChildren}
                data={data.children}
                columns={columnsList}
            ></ProductLinesChildGrid>
          </section>
      )},
    },
    {
      headerName: "Mfr No",
      field: "mfrNumber",
      sortable: false,
    },
    {
      headerName: "Vendor No",
      field: "vendorPartNo",
      sortable: false,
    },
    {
      headerName: "Ref No",
      field: "tdNumber",
      sortable: false,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: false,
    },
    {
      headerName: "Unit Price",
      field: "unitPrice",
      sortable: false,
      valueFormatter: (props) => {
        return props.value ? props.value.toLocaleString() : '';
      },
    },
    {
      headerName: "Total price (USD)",
      field: "totalPrice",
      sortable: false,
      valueFormatter: (props) => {
        return props.value ? props.value.toLocaleString() : '';
      },
    },
  ];

  //copying arrays
  /**@type {any[]} */
  const columnDefsChildren = JSON.parse(JSON.stringify(columnDefs));
  
  columnDefsChildren.push({
    headerName: "Description",
    field: "displayName",
    width: "600px",
    cellHeight: () => 80,
    sortable: false,
    cellRenderer: (props) => {
      return (gridProps.shopDomainPage ?
              <ProductLinesItemInformation
                headerName={props?.colDef?.headerName}
                line={props.data}
                shopDomainPage={gridProps.shopDomainPage} 
                emptyImageUrl={gridProps.productEmptyImageUrl}  
              /> :
              <a
                  className="cmp-grid-url-underlined"
                  href="#"
                  target="_blank"
              >
                {props.value}
              </a>
      );
    },
  })
  
  columnDefsChildren.push({
    headerName: "Description",
    field: "description",
    width: "600px",
    cellHeight: () => 80,
    sortable: false,
    cellRenderer: (props) => {
      return (gridProps.shopDomainPage ?
              <ProductLinesItemInformation 
              headerName={props?.colDef?.headerName}
              line={props.data} 
              shopDomainPage={gridProps.shopDomainPage}
              emptyImageUrl={gridProps.productEmptyImageUrl}
            /> :
              <a
                  className="cmp-grid-url-underlined"
                  href="#"
                  target="_blank"
              >
                {props.value}
              </a>
      );
    },
  })

  columnDefsChildren.push({
    headerName: "Status",
    field: "status",
    sortable: false,
    cellRenderer: (props) => {
      return (
          <span className='status'>
              <i className={`icon ${applyStatusIcon(props.value)?.iconValue}`}></i>
              <div className='text'>{applyStatusIcon(props.value)?.iconText}</div>
          </span>
      );
    },
  })

  columnDefsChildren.push({
    headerName: "Invoice",
    field: "invoice",
    sortable: false,
    cellRenderer: (props) => {
      const orderID = props.data.id;
      const invoiceId = props.data.invoices[0]?.id;
      return (
          <div onClick={() => openInvoicePdf(invoiceId, orderID)}>
            <span className='status'>
              <a
                disabled="disabled"
                className='cmp-grid-url-underlined'
                target="_blank">
                <i className="fas fa-external-link-alt"></i>
              </a>
            </span>
          </div>
      );
    },
  })

  // nedd come from data-config
  columnDefsChildren.push({
    headerName: 'Ship Date',
    field: 'shipDates',
    sortable: false,
    cellRenderer: ({ data }) => {
      let date = getShipDateFromTracking(data);
      if (date ==='Invalid Date'){
        date = NO_SHIP_DATE_LABEL;
      }
      return (
          <div>{date}</div>
      );
    },
  });
  //Serials behave differently in parent grid and child grid
  columnDefsChildren.push(
      {
        headerName: "Serial",
        field: "serials",
        sortable: false,
        cellRenderer: (props) => {
          return (
              props.value && props.value.length ? (
                  <div
                      className="cmp-grid-url-underlined"
                      href="#"
                      target="_blank"
                      onClick={() => {
                        invokeModal({
                          content: (
                              <OrderDetailsSerialNumbers data={props.value}></OrderDetailsSerialNumbers>
                          ),
                          properties: {
                            title: gridProps.serialModal ? gridProps.serialModal : "Serial Numbers",
                          }
                        });
                      }}
                  >
                    {gridProps.serialCellLabel ? gridProps.serialCellLabel : "view"}
                  </div>
              ) : (
                  <div>{gridProps.serialCellNotFoundMessage ? gridProps.serialCellNotFoundMessage : "n/a"}</div>
              )
          );
        },
      }
  );
  
  //Tracking behaves differently between parent and child
  columnDefsChildren.push({
    headerName: 'Track',
    field: 'trackings',
    sortable: false,
    cellRenderer: ({ node, api, setValue, data, value }) => {
      return (
          <div
              onClick={() => {
                invokeModal({
                  content: (
                    <TrackOrderModal
                      data={data}
                      trackingConfig={gridConfig.trackingConfig}
                      pendingInfo={trackingModal.pendingInfo}
                      showMoreFlag={showMoreFlag}
                    ></TrackOrderModal>
                  ),
                  properties: {
                    title: getTrackingModalTitle(gridProps.trackingConfig?.modalTitle, value),
                  }
                });
              }} className='icon'>{getTrackingStatus(value) ? <i className='fas fa-truck'></i> : <div></div>}</div>

      );
    },
  });

  //Display Name behave differently in parent grid and child grid
  columnDefs.push({
    headerName: "Description",
    field: "displayName",
    width: "600px",
    cellHeight: () => 80,
    sortable: false,
    cellRenderer: (props) => {
      return (gridProps.shopDomainPage ?
              <ProductLinesItemInformation 
                headerName={props?.colDef?.headerName}
                line={props.data} 
                shopDomainPage={gridProps.shopDomainPage} 
                emptyImageUrl={gridProps.productEmptyImageUrl}
              /> :
              <a
                  className="cmp-grid-url-underlined"
                  href="#"
                  target="_blank"
              >
                {props.value}
              </a>
      );
    },
  })
  
  //Drescription behave differently in parent grid and child grid
  columnDefs.push({
    headerName: "Description",
    field: "description",
    width: "600px",
    cellHeight: () => 80,
    sortable: false,
    cellRenderer: (props) => {
      return (gridProps.shopDomainPage ?
                <ProductLinesItemInformation 
                  headerName={props?.colDef?.headerName}
                  line={props.data}
                  shopDomainPage={gridProps.shopDomainPage} 
                  emptyImageUrl={gridProps.productEmptyImageUrl}
                /> :
              <a
                  className="cmp-grid-url-underlined"
                  href="#"
                  target="_blank"
              >
                {props.value}
              </a>
      );
    },
  })
  
  
  columnDefs.push({
    headerName: "Status",
    field: "status",
    sortable: false,
    cellRenderer: (props) => {
      return (
          <span className='status'>
              <i className={`icon ${applyStatusIcon(props.value)?.iconValue}`}></i>
              <div className='text'>{applyStatusIcon(props.value)?.iconText}</div>
          </span>
      );
    },
  })
  columnDefs.push({
    headerName: "Invoice",
    field: "invoice",
    sortable: false,
    cellRenderer: (props) => {
      return (
          <div onClick={() => handlerInvoiceClick(props.data)}>
            <span className='status'>
              <a
                disabled="disabled"
                className='cmp-grid-url-underlined'
                target="_blank">
                <i className="fas fa-external-link-alt"></i>
              </a>
            </span>
          </div>
          
      );
    },
  })

  columnDefs.push({
    headerName: "Serial",
    field: "serials",
    sortable: false,
    cellRenderer: (props) => {
      return (
          props.value && props.value.length ? (
              <div
                  className="cmp-grid-url-underlined"
                  href="#"
                  target="_blank"
                  onClick={() => {
                    invokeModal({
                      content: (
                          <OrderDetailsSerialNumbers data={props.value}></OrderDetailsSerialNumbers>
                      ),
                      properties: {
                        title: gridProps.serialModal ? gridProps.serialModal : "Serial Numbers",
                      }
                    });
                  }}
              >
                {gridProps.serialCellLabel ? gridProps.serialCellLabel : "view"}
              </div>
          ) : (
              <div>{gridProps.serialCellNotFoundMessage ? gridProps.serialCellNotFoundMessage : "n/a"}</div>
          )
      );
    },
  });

  //Tracking behaves differently between parent and child
  columnDefs.push(    {
    headerName: 'Track',
    field: 'trackings',
    sortable: false,
    cellRenderer: ({ node, api, setValue, data, value }) => {
      return (
          <div
              onClick={() => {
                invokeModal({
                  content: (
                    <TrackOrderModal
                      data={data}
                      trackingConfig={gridConfig.trackingConfig}
                      pendingInfo={trackingModal.pendingInfo}
                      showMoreFlag={showMoreFlag}
                    ></TrackOrderModal>
                  ),
                  properties: {
                    title: getTrackingModalTitle(gridProps.trackingConfig?.modalTitle, value),
                  }
                });
              }} className='icon'>{getTrackingStatus(value) ? <i className='fas fa-truck'></i> : <div></div>}</div>

      );
    },
  });

  //Ship Date behaves differently between parent and child
  columnDefs.push( {
    headerName: "Ship Date",
    field: "shipDates",
    sortable: false,
    cellRenderer: ({ data }) => {
      let date = getShipDateFromTracking(data);
      if (date ==='Invalid Date'){
        date = NO_SHIP_DATE_LABEL;
      }
      return (
          <div>{date}</div>
      );
    },
  });



  //whitelabel column defs
  const whiteLabelCols = () => {
    const removedIds = ["discounts", "unitListPriceFormatted"];
    const filteredCols = Object.assign([], columnDefs).filter(
      (el) => !removedIds.includes(el.field)
    );
    const extended = [
      ...filteredCols,
      {
        headerName: "Markup",
        field: "appliedMarkup",
        onDetailsShown: (row) => {},
        onDetailsHidden: (row) => {},
        cellClass: ({ node, data }) => {
          return "cmp-product-lines-grid__row__cell__markup";
        },
        headerClass: "cmp-product-lines-grid__th__markup",
        cellRenderer: (props) => {
          const { node, api, value, setValue, data } = props;
          return (
            <ProductLinesMarkupRow
              onMarkupValueChanged={({ value, unit, source }) => {
                setValue(value);
                api.refreshCells({
                  columns: ["clientUnitPrice"],
                  force: true,
                });
                if (source === "internal") {
                  markupChanged(mutableGridData);
                }
              }}
              initialMarkup={value || 0}
              resellerUnitPrice={data.unitPrice}
              labels={labels}
            ></ProductLinesMarkupRow>
          );
        },
        valueFormatter: ({ data }) => {
          return 0;
        },
        sortable: false,
      },
      {
        headerName: "Client Unit Price",
        field: "clientUnitPrice",
        onDetailsShown: (row) => {},
        onDetailsHidden: (row) => {},
        cellClass: ({ node, data }) => {
          return "cmp-product-lines-grid__row__cell__client-cost";
        },
        headerClass: "cmp-product-lines-grid__th__client-cost",
        cellRenderer: ({ node, api, value, setValue, data }) => {
          const _ = Number(data.appliedMarkup) + Number(data.unitPrice);
          setValue(_);
          api.refreshCells({
            columns: ["clientExtendedPrice"],
            force: true,
          });
          return "$" + thousandSeparator(_);
        },
        sortable: false,
      },
      {
        headerName: "Client Extended Price",
        field: "clientExtendedPrice",
        onDetailsShown: (row) => {},
        onDetailsHidden: (row) => {},
        cellClass: ({ node, data }) => {
          return "cmp-product-lines-grid__row__cell__client-cost";
        },
        headerClass: "cmp-product-lines-grid__th__client-cost",
        cellRenderer: ({ node, api, value, setValue, data }) => {
          const _ = Number(data.clientUnitPrice) * Number(data.quantity);
          setValue(_);
          return "$" + thousandSeparator(_);
        },
        sortable: false,
      },
    ];
    return extended.map((col) => {
      if (col.field === "shortDescription") {
        col.width = "400px";
      }
      return col;
    });
  };

  /**
   * Funtion that get the values to filter
   * @param {string} query 
   */
  const filterByProps = (query) => {
    const items = query.split('&');
    const filters = [];
    items.shift();
    items.forEach(i => {
      const r = i.split('=');
      const filterObject = { key: r[0], value: r[1]};
      filters.push(filterObject)
    });

    return filters;
  };

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote" ? true : false);
  }, [quoteOption]);

  /**
   * function that filter the values specifically for the SerachBy values
   * @param {any} object 
   * @param {string} value 
   * @returns
   */
   const filterBySearchDropDown = (value, object) => {
    if (value === 'allLines') {
      return true
    }
    if (object[value]) {
      return true
    }

    return false
  };

  /**
   * 
   * @param {string} value 
   * @param {any} object 
   * @returns 
   */
  const filterByQueryInput = (value, object) => {
    const valueLowerCase = value.toLowerCase();
    const descriptionVal = object.description?.toLowerCase().includes(valueLowerCase) ? true : false
    const vendorPartNoVal = object.vendorPartNo?.toLowerCase().includes(valueLowerCase) ? true : false
    const displayName = object.displayName?.toLowerCase().includes(valueLowerCase) ? true : false;
    const tdNumber = object.tdNumber?.toLowerCase().includes(valueLowerCase) ? true : false;
    return descriptionVal || vendorPartNoVal || displayName || tdNumber ? true : false
  };

  /**
   * Filters an array of objects using custom predicates.
   *
   * @param  {Array}  array: the array to filter
   * @param  {any[]} filters: an object with the filter criteria
   * @return {Array}
   */
  function filterArray(array, filters) {
    let searchByValue = '';
    let descriptionValue = '';
    filters.forEach(f => {
      if (f.key === 'searchBy') {
        searchByValue = f.value
      }
    
      if (f.key === 'description') {
        descriptionValue = f.value
        
      }
    })
    const result = array.filter(f => {
      const searchByDropDownValue = searchByValue !== '' ? filterBySearchDropDown(searchByValue, f) : true
      const _descriptionValue =  filterByQueryInput(descriptionValue, f);
      return _descriptionValue && searchByDropDownValue
    });

    return result;
  }

  useEffect(() => {
    if (queryChange !== '') {
      const filters = filterByProps(queryChange.queryString); // Get filters queryString
      
      const _filterData = filterArray(mutableGridData, filters); // Get filter data
      setfilterGridData(_filterData)
      setFlagData(true);
      setQuerychange(''); 
    }
  },[mutableGridData, queryChange]);

  const updateItems = () => {
    gridApi.applyTransaction({ remove: mutableGridData });
    const res = gridApi.applyTransaction({ add: filterGridData });
    setfilterGridData([]);
  };

  useEffect(() => {
    if (flagData) {
      updateItems();
      setFlagData(false)
    }
  }, [flagData]);

  const onSearchRequest = (query) => {
    handleFilterComponent(query.analyticsData);
    setQuerychange(query);
  };

  const onClearSearchRequest = () => {
    gridApi.setRowData([]);
    setfilterGridData([]);
    setQuerychange('')
    gridApi.applyTransaction({ add: mutableGridData });
  };

  /**
   * 
   * @param {any} analyticObjectParam 
   */
   const handleFilterComponent = (analyticObjectParam) => {
    const orderDetails = {
      searchTerm: analyticObjectParam.searchTerm,
      searchCategory : isNotEmptyValue(analyticObjectParam.category) ? analyticObjectParam.category : "" ,
    };
    const objectToSend = {
      event: ANALYTICS_TYPES.events.orderDetailsSearch,
      orderDetails,
    }
    pushEventAnalyticsGlobal(objectToSend);
  };

  const setProductInfoObject = (dataItem) => {
    return {
      parentSKU : isNotEmptyValue(dataItem?.tdNumber) ? dataItem?.tdNumber : '',
      name: isNotEmptyValue(dataItem?.displayName) ? dataItem?.displayName : ''
    };
  }
  

  /**
   * Handler that is called when the item 
   * is collapsed
   */
   const handlerAnalyticCollapseAction = (item) => {
    const productInfo = setProductInfoObject(item.data);
    const clickInfo = {
      type : ANALYTICS_TYPES.types.button,
      category : ANALYTICS_TYPES.category.orderDetailTableInteraction,
      name : ANALYTICS_TYPES.name.collapseLineItem,
    };
    const objectToSend = {
      event: ANALYTICS_TYPES.events.click,
      products: productInfo,
      clickInfo,
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  /**
   * Handler that is called when the item 
   * is expanded
   */
   const handlerAnalyticExpandAction = (item) => {
    const clickInfo = {
      type : ANALYTICS_TYPES.types.button,
      category : ANALYTICS_TYPES.category.orderDetailTableInteraction,
      name : ANALYTICS_TYPES.name.openLineItem,
    };
    const productInfo = setProductInfoObject(item.data);
    const objectToSend = {
      event: ANALYTICS_TYPES.events.click,
      products: productInfo,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };
  
  /**
   * Handler that is called when the quantity
   * item is clicked
   */
  const  handlerAnalyticInvoiceClick = (item) => {
    const clickInfo = {
      type : ANALYTICS_TYPES.types.button,
      category : ANALYTICS_TYPES.category.orderDetailTableInteraction,
      name : ANALYTICS_TYPES.name.invoice,
    };
    const productInfo = setProductInfoObject(item);
    const objectToSend = {
      event: ANALYTICS_TYPES.events.click,
      products: productInfo,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  /**
   * action true = collapseAll
   * action false = openAll
   * @param {boolean} action 
   */
  const handlerAnalyticCollapsedOrExpandAll = (action) => {
    const clickInfo = {
      type : ANALYTICS_TYPES.types.link,
      category : ANALYTICS_TYPES.category.orderDetailTableInteraction,
      name : action ? ANALYTICS_TYPES.name.collapseAll : ANALYTICS_TYPES.name.openAll,
    };
    const objectToSend = {
      event: ANALYTICS_TYPES.events.click,
      clickInfo
    };
    pushEventAnalyticsGlobal(objectToSend);
  };

  return (
    <section>
      {whiteLabelMode && (
        <ProductLinesMarkupGlobal
          labels={labels}
          onMarkupValueChanged={() => {
            markupChanged(mutableGridData);
          }}
        ></ProductLinesMarkupGlobal>
      )}
       
      <div className="cmp-product-lines-grid">
        <section className="cmp-product-lines-grid__header">
          <div style={{display: "flex"}}>
            <span className="cmp-product-lines-grid__header__title">
              {gridProps?.label || "Line Item Details"}
            </span>
            <span className="cmp-product-lines-grid__header__expand-collapse">
              <span onClick={() => expandAll()}>
                {" "}
                {gridProps?.expandAllLabel || "Expand All"}
              </span>{" "}
              |
              <span onClick={() => collapseAll()}>
                {" "}
                {gridProps?.collapseAllLabel || "Collapse All"}
              </span>
            </span>
          </div>
        </section>
        
        <GridSearchCriteria
            Filters={OrderDetailsSearch}
            label={gridProps.searchCriteria?.title ?? 'Filter Orders'}
            componentProp={gridProps.searchCriteria}
            onSearchRequest={onSearchRequest}
            onClearRequest={onClearSearchRequest}
          ></GridSearchCriteria>
          
        <Grid
          key={whiteLabelMode}
          columnDefinition={whiteLabelMode ? whiteLabelCols() : columnDefs}
          config={gridConfig}
          data={mutableGridData}
          onAfterGridInit={onAfterGridInit}
          requestInterceptor={(request) =>
            filteringExtension.requestInterceptor(request)
          }
          flagData={flagData}
          setFlagData={setFlagData}
          requestLocalFilter={(request) =>
            filteringExtension.requestLocalFilter(request)
          }
          handlerIsRowMaster={handlerIsRowMaster}
          onExpandAnalytics={handlerAnalyticExpandAction}
          onCollapseAnalytics={handlerAnalyticCollapseAction}
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
}

export default ProductLinesGrid;
