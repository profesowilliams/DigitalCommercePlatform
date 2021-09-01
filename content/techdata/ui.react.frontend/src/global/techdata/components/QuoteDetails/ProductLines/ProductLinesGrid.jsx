import React, { useEffect, useState } from "react";
import thousandSeparator from "../../../helpers/thousandSeparator";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";

function ProductLinesGrid({ gridProps, data }) {
  const [gridApi, setGridApi] = useState(null);
  const gridData = data.items ?? [];
  const mutableGridData = Object.assign([], gridData);

  useEffect(() => {
    gridApi?.selectAll();
  }, [gridApi]);

  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  const columnDefs = [
    {
      headerName: "Line Item",
      field: "id",
      width: "80px",
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
              columnDefiniton={columnDefs}
              data={data.children}
            ></ProductLinesChildGrid>
          </section>
        );
      },
    },
    {
      headerName: "Item Information",
      field: "shortDescription",
      sortable: false,
      width: "600px",
      cellHeight: () => 80,
      cellRenderer: (props) => {
        return <ProductLinesItemInformation line={props.data} />;
      },
    },
    {
      headerName: "MSRP/Unit List Price",
      field: "unitListPriceFormatted",
      sortable: false,
      valueFormatter: ({ value }) => {
        return "$" + value;
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      width: "120px",
      sortable: false,
    },
    {
      headerName: "Unit Price",
      field: "unitPrice",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitPrice);
      },
      sortable: false,
    },
    {
      headerName: "Extended Price",
      field: "extendedPriceFormatted",
      onDetailsShown: (row) => {},
      onDetailsHidden: (row) => {},
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitPrice * data.quantity);
      },
      sortable: false,
    },
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

  return (
    <section>
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
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
          onAfterGridInit={onAfterGridInit}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
