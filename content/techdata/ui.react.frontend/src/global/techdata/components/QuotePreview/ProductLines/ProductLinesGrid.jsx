import React from "react";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";
import ProductLinesQuantityWidget from "./ProductLinesQuantityWidget";

function ProductLinesGrid({ gridProps, data }) {
  const gridData = data.content?.quotePreview?.quoteDetails.items ?? [];
  const mutableGridData = JSON.parse(JSON.stringify(gridData));

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
      valueFormatter: ({ data }) => {
        return data.unitPrice * data.quantity;
      },
      sortable: false,
    },
  ];

  return (
    <section>
      <div className="cmp-product-lines-grid">
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
