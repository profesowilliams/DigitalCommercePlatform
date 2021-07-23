import React, { useEffect } from "react";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";
import ProductLinesQuantityWidget from "./ProductLinesQuantityWidget";

function ProductLinesGrid({ gridProps, data, onQuoteLinesUpdated }) {
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
    if (typeof onQuoteLinesUpdated === "function") {
      onQuoteLinesUpdated(selectedLinesModel);
    }
  }, []);

  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  const columnDefs = [
    {
      headerName: "Select All",
      field: "id",
      sortable: false,
      checkboxSelection: true,
      width: "80px",
      headerCheckboxSelection: true,
      expandable: true,
      detailRenderer: (props) => {
        return (
          <section>
            <div className="cmp-product-lines-grid__row--expanded">
              <ProductLinesChildGrid
                data={mutableGridData}
              ></ProductLinesChildGrid>
            </div>
          </section>
        );
      },
    },
    {
      headerName: "Item Information",
      field: "shortDescription",
      sortable: false,
      setRowHeight: () => 80,
      cellRenderer: (props) => {
        return <ProductLinesItemInformation line={props.data} />;
      },
    },
    {
      headerName: "MSRP/Unit List Price",
      field: "unitListPriceFormatted",
      sortable: false,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: false,
      cellRenderer: ({ rowIndex, api, setValue }) => {
        return (
          <ProductLinesQuantityWidget
            initialValue={gridData[rowIndex].quantity}
            onValueChanged={(_val) => {
              isDataMutated = true;
              setValue(_val);
              api.refreshCells({
                columns: ["extendedPriceFormatted"],
                force: true,
              });
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
      valueFormatter: ({ api, data, node }) => {
        isDataMutated && node.selected && onSelectionChanged({ api });
        return data.unitPrice * data.quantity;
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

  return (
    <section>
      <div className="cmp-product-lines-grid">
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
          onSelectionChanged={onSelectionChanged}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
