import React, { useEffect, useState } from "react";

import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";
import ProductLinesMarkupGlobal from "./ProductLinesMarkupGlobal";
import ProductLinesMarkupRow from "./ProductLinesMarkupRow";
import { thousandSeparator } from "../../../helpers/formatting";
import Modal from "../../Modal/Modal";
import OrderDetailsSerialNumbers from "../OrderDetailsSerialNumbers/OrderDetailsSerialNumbers";

function ProductLinesGrid({
  gridProps,
  data,
  labels,
  quoteOption,
  onMarkupChanged,
}) {

  const [gridApi, setGridApi] = useState(null);
  const gridData = data.items ?? [];
  const mutableGridData = Object.assign([], gridData);
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [modal, setModal] = useState(null);
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };
  const columnsArray = gridConfig.columnList;
  const iconList = gridProps.iconList
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
    { iconKey: STATUS.open, iconValue: 'fas fa-box-open', iconText: 'Opeeeen' },
    { iconKey: STATUS.shipped, iconValue: 'fas fa-check', iconText: 'Shipped' },
    { iconKey: STATUS.cancelled, iconValue: 'fas fa-ban', iconText: 'Cancelled' },
  ];

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
  //default column defs
  const columnDefs = [
    {
      headerName: "Line Item",
      field: "id",
      width: "100px",
      sortable: false,
      expandable: true,
      rowClass: ({ node, data }) => {
        return `cmp-product-lines-grid__row ${
            !data?.children || data.children.length === 0
                ? "cmp-product-lines-grid__row--notExpandable"
                : ""
        }`;
      },
      detailRenderer: ({ data }) => (
          <section className="cmp-product-lines-grid__row cmp-product-lines-grid__row--expanded">
            <ProductLinesChildGrid
                columnDefiniton={columnDefs}
                data={data.children}
            ></ProductLinesChildGrid>
          </section>
      ),
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
      width: "250px",
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
    },
    {
      headerName: "Ship Date",
      field: "shipDate",
      sortable: false,
      valueFormatter: (props) => {
        return getDateTransformed(props.value);
      },
    },
    {
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
    },
    {
      headerName: "Ship Date",
      field: "shipDate",
      sortable: false,
      valueFormatter: (props) => {
        return getDateTransformed(props.value);
      },
    },
    {
      headerName: "Serial",
      field: "serial",
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
                          title: gridProps.serialModal ? gridProps.serialModal : "Serial Modal",
                        }
                      });
                    }}
                >
                  {gridProps.serialCellLabel ? gridProps.serialCellLabel : "view"}
                </div>
            ) : (
                <div>n/a</div>
            )
        );
      },
    },
    {
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
    },
  ];

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
        </section>
        <Grid
          key={whiteLabelMode}
          columnDefinition={whiteLabelMode ? whiteLabelCols() : columnDefs}
          config={gridConfig}
          data={mutableGridData}
          onAfterGridInit={onAfterGridInit}
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
