import React, { useEffect, useState } from "react";
import thousandSeparator from "../../../helpers/thousandSeparator";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";
import ProductLinesQuantityWidget from "./ProductLinesQuantityWidget";

function ProductLinesGrid({ gridProps, data, onQuoteLinesUpdated }) {
  const [gridApi, setGridApi] = useState(null);
  const gridData = data.content?.quotePreview?.quoteDetails.items ?? [];
  /*
    grid data can be mutated intentionally by changing quantity in each row. 
    so in order to not mutate props, mutableGridData is clone of the data that is
    used in full component lifecycle and orignal data is kept for reference
  */
  const mutableGridData = JSON.parse(JSON.stringify(gridData));
  const selectedLinesModel = [];
  let isDataMutated = false;

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
      headerName: "Select All",
      field: "id",
      width: "160px",
      sortable: false,     
      checkboxSelection: true, 
      headerCheckboxSelection: true,
      expandable: true,
      rowClass: ({ node, data }) => "cmp-product-lines-grid__row",
      detailRenderer: ({ data }) => {
        return (
          <section className="cmp-product-lines-grid__row cmp-product-lines-grid__row--expanded">
            <ProductLinesChildGrid data={data.children}></ProductLinesChildGrid>
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
      }
    },
    {
      headerName: "Quantity",
      field: "quantity",
      width: "120px",
      sortable: false,
      cellRenderer: ({ rowIndex, node, api, setValue }) => {
        return (
          <ProductLinesQuantityWidget
            initialValue={gridData[rowIndex]?.quantity}
            selectedValue={mutableGridData[rowIndex]?.quantity}
            onValueChanged={(_val) => {
              isDataMutated = true;
              setValue(_val);
              api.refreshCells({
                columns: ["extendedPriceFormatted"],
                force: true,
              });
              node.selected && onSelectionChanged({ api });
            }}
          ></ProductLinesQuantityWidget>
        );
      },
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

  function onSelectionChanged({ api }) {
    selectedLinesModel.length = 0;
    api.forEachNode((rowNode) => {
      const _price = rowNode.data.quantity * rowNode.data.unitPrice;
      rowNode.data.extendedPrice = _price;
      const _row = Object.assign({}, rowNode.data);
      delete _row.extendedPriceFormatted;
      rowNode.selected && selectedLinesModel.push(_row);
    });
    if (typeof onQuoteLinesUpdated === "function") {
      onQuoteLinesUpdated(selectedLinesModel);
    }
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

  return (
    <section>
      <div className="cmp-product-lines-grid">
        <section className="cmp-product-lines-grid__header">
          <span className="cmp-product-lines-grid__header__title">
            {gridProps.label}
          </span>
          <span className="cmp-product-lines-grid__header__expand-collapse">
            <span onClick={() => expandAll()}> {gridProps.expandAllLabel}</span>{" "}
            |
            <span onClick={() => collapseAll()}>
              {" "}
              {gridProps.collapseAllLabel}
            </span>
          </span>
        </section>
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
          onSelectionChanged={onSelectionChanged}
          onAfterGridInit={onAfterGridInit}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
