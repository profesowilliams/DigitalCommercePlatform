import React, { useEffect, useState } from "react";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesMarkupGlobal from "./ProductLinesMarkupGlobal";
import ProductLinesMarkupRow from "./ProductLinesMarkupRow";
import TrackOrderModal from "../TrackOrderModal/TrackOrderModal";
import useGridFiltering from "../../../hooks/useGridFiltering";
import OrderDetailsSearch from "../OrderDetailsGridSearch/OrderDetailsGridSearch";
import GridSearchCriteria from "../../Grid/GridSearchCriteria";
import { thousandSeparator } from "../../../helpers/formatting";
import Modal from "../../Modal/Modal";
import OrderDetailsSerialNumbers from "../OrderDetailsSerialNumbers/OrderDetailsSerialNumbers";

function ProductLinesGrid({
  gridProps,
  data,
  labels,
  quoteOption,
  onMarkupChanged,
  iconList
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
  const NO_SHIP_DATE_LABEL = gridConfig?.noShipDateLabel ? gridConfig.noShipDateLabel : 'No Ship Date'
  const filteringExtension = useGridFiltering();  
  const columnsList = gridConfig.columnList;
  const columnsArray = gridConfig.columnList;
  const STATUS = {
    onHold: 'onHold',
    inProcess: 'inProcess',
    open: 'open',
    shipped: 'shipped',
    cancelled: 'cancelled',
  };
  const defaultIcons = [
    { iconKey: STATUS.onHold, iconValue: 'fas fa-hand-paper', iconText: 'On Hold' },
    { iconKey: STATUS.inProcess, iconValue: 'fas fa-dolly', iconText: 'In Process' },
    { iconKey: STATUS.open, iconValue: 'fas fa-box-open', iconText: 'Open' },
    { iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Shipped' },
    { iconKey: STATUS.cancelled, iconValue: 'fas fa-ban', iconText: 'Cancelled' },
  ];
  const [flagData, setFlagData] = useState(false);
  function invokeModal(modal) {
    setModal(modal);
  }

  function expandAll() {
    gridApi?.forEachNode((node) => {
      node.expanded = true;
    });
    gridApi?.expandAll();
  }

  function collapseAll() {
    gridApi?.forEachNode((node) => {
      node.expanded = false;
    });
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
    let icon = iconList?.find((icon) => icon.iconKey === statusKey);
    if (!icon) icon = defaultIcons.find((icon) => icon.iconKey === statusKey);
    return icon;
  }

  function getDateTransformed(dateUTC) {
    const formatedDate = new Date(dateUTC).toLocaleDateString();
    return formatedDate;
  }

  function getShipDateFromTracking(trackingObject)
  {
    const firstShipDateValue = trackingObject.shipDates !== undefined && trackingObject.shipDates.length > 0 ? trackingObject.shipDates[0] : '*';
    return getDateTransformed(firstShipDateValue)
  }

  function getTrackingStatus(trackingArray) {
    return trackingArray.length ? trackingArray.length > 0 : false;
}

  //default column defs
  const columnDefs = [
    {
      headerName:  "Line Item",
      field:  "displayLineNumber",
      sortable: false,
      expandable: true,
      rowClass: ({ node, data }) => {
        return `cmp-product-lines-grid__row ${
            !data?.children || data.children.length === 0
                ? "cmp-product-lines-grid__row--notExpandable"
                : ""
        }`;
      },
      detailRenderer: ({ data }) => {
        return (
          <section className="cmp-product-lines-grid__row cmp-product-lines-grid__row--expanded">
            <ProductLinesChildGrid
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
      headerName: "Ref No",
      field: "tdNumber",
      sortable: false,
    },
    {
      headerName: "Description",
      field: "description",
      sortable: false,
      cellRenderer: (props) => {
        return (
            <a
                className="cmp-grid-url-underlined"
                href={props.value}
                target="_blank"
            >
              {props.value}
            </a>
        );
      },
    },
    {
      headerName: "Description",
      field: "displayName",
      sortable: false,
      cellRenderer: (props) => {
        return (
            <a
                className="cmp-grid-url-underlined"
                href={props.value}
                target="_blank"
            >
              {props.value}
            </a>
        );
      },
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
        return props.value.toLocaleString();
      },
    },
    {
      headerName: "Total price (USD)",
      field: "totalPrice",
      sortable: false,
      valueFormatter: (props) => {
        return props.value.toLocaleString();
      },
    },
  ];

  //copying arrays
  /**@type {any[]} */
  const columnDefsChildren = JSON.parse(JSON.stringify(columnDefs));
  
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
      return (
          <span className='status'>
            <a
                className='cmp-grid-url-underlined'
                href={props.value ? props.value : '#'}
                target="_blank">
              <i className="fas fa-external-link-alt"></i>
            </a>
          </span>
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
                      <TrackOrderModal data={data}></TrackOrderModal>
                  ),
                  properties: {
                    title: `Track My Order `,
                  }
                });
              }} className='icon'>{getTrackingStatus(value) ? <i className='fas fa-truck'></i> : <div></div>}</div>

      );
    },
  });

  
  
  //Serials behave differently in parent grid and child grid
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
          <span className='status'>
            <a
                className='cmp-grid-url-underlined'
                href={props.value ? props.value : '#'}
                target="_blank">
              <i className="fas fa-external-link-alt"></i>
            </a>
          </span>
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
                      <TrackOrderModal data={data}></TrackOrderModal>
                  ),
                  properties: {
                    title: `Track My Order `,
                  }
                });
              }} className='icon'>{getTrackingStatus(value) ? <i className='fas fa-truck'></i> : <div></div>}</div>
      );
    }
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

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote" ? true : false);
  }, [quoteOption]);

  useEffect(() => {
    if (queryChange !== '') {
      const queryString = queryChange.queryString; 
      const resul = queryString.split('=')[1];
      if (resul === 'allLines') {
        onClearSearchRequest();
        return;
      }
      let _filterData = [];
      if (resul === 'licenses') {
        _filterData = mutableGridData.filter(m => m.license !== null)
      } else {
        _filterData = mutableGridData.filter(m => m.contract !== null)
      }
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

  const onSearchRequest = (query) => 
    setQuerychange(query);

  const onClearSearchRequest = () => {
    gridApi.setRowData([]);
    setfilterGridData([]);
    setQuerychange('')
    gridApi.applyTransaction({ add: mutableGridData });
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

export default ProductLinesGrid;
