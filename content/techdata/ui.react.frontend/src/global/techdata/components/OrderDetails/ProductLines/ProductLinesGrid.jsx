import React, { useEffect, useState } from "react";

import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";
import ProductLinesMarkupGlobal from "./ProductLinesMarkupGlobal";
import ProductLinesMarkupRow from "./ProductLinesMarkupRow";
import { thousandSeparator } from "../../../helpers/formatting";

function ProductLinesGrid({
  gridProps,
  data,
  labels,
  quoteOption,
  onMarkupChanged,
  iconList,
}) {
  const [gridApi, setGridApi] = useState(null);
  const gridData = data.items ?? [];
  const mutableGridData = Object.assign([], gridData);
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };
  
  const columnsList = gridConfig.columnList;
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
  console.log('columnsArray', columnsList);
  //default column defs
  const columnDefs = [
    {
      headerName: columnsList.length > 0 ? columnsList[0].columnLabel : "Line Item",
      field: columnsList.length > 0 ? columnsList[0].columnKey :"id",
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
      headerName: columnsList.length > 0 ? columnsList[1].columnLabel : "Mfr No",
      field: columnsList.length > 0 ? columnsList[1].columnKey : "mfrNumber",
      sortable: false,
    },
    {
      headerName: columnsList.length > 0 ? columnsList[2].columnLabel : "Ref No",
      field: columnsList.length > 0 ? columnsList[2].columnKey : "tdNumber",
      sortable: false,
    },
    {
      headerName: columnsList.length > 0 ? columnsList[3].columnLabel : "Description",
      field: columnsList.length > 0 ? columnsList[3].columnKey : "description",
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
      headerName: columnsList.length > 0 ? columnsList[4].columnLabel : "***Quantity",
      field: columnsList.length > 0 ? columnsList[4].columnKey : "quantity",
      sortable: false,
    },
    {
      headerName: columnsList.length > 0 ? columnsList[5].columnLabel : "Unit Price",
      field: columnsList.length > 0 ? columnsList[5].columnKey : "unitPrice",
      sortable: false,
      valueFormatter: (props) => {
        return props.value.toLocaleString();
    },
    },
    {
      headerName: columnsList.length > 0 ? columnsList[6].columnLabel : "Total price (USD)",
      field: columnsList.length > 0 ? columnsList[6].columnKey : "totalPrice",
      sortable: false,
    },
    
    {
      headerName: columnsList.length > 0 ? columnsList[7].columnLabel : "Status",
      field: columnsList.length > 0 ? columnsList[7].columnKey : "status",
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
      headerName: columnsList.length > 0 ? columnsList[8].columnLabel : "Ship Date",
      field: columnsList.length > 0 ? columnsList[8].columnKey : "shipDate",
      sortable: false,
      valueFormatter: (props) => {
        return getDateTransformed(props.value);
      },
    },
    {
      headerName:  columnsList.length > 0 ? columnsList[9].columnLabel : "Serial",
      field:  columnsList.length > 0 ? columnsList[9].columnKey : "serial",
      sortable: false,
      cellRenderer: (props) => {
        return (
          props.value ? (
            <a
              className="cmp-grid-url-underlined"
              href={props.value}
              target="_blank"
            >
              view
            </a>
          ) : (
            <div>n/a</div>
          )
        );
      },
    },
    {
      headerName: columnsList.length > 0 ? columnsList[10].columnLabel : "Invoice",
      field: columnsList.length > 0 ? columnsList[10].columnKey : "invoice",
      sortable: false,
      cellRenderer: (props) => {
        return (
            <span className='status'>
              <a 
                className='cmp-grid-url-underlined'
                href={props.value ? props.value : '#'}
                target="_blank">
                <i class="fas fa-external-link-alt"></i>
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
    </section>
  );
}

export default ProductLinesGrid;
