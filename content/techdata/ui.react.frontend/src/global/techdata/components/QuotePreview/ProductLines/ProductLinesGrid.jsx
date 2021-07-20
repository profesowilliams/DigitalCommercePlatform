import React from "react";
import Grid from "../../Grid/Grid";
import ProductLinesChildGrid from "./ProductLinesChildGrid";

function ProductLinesGrid({ gridProps, data }) {
  const gridData = data.content?.quotePreview?.quoteDetails.items ?? [];
  console.log(gridData);

  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none"
  };
  console.log(gridConfig);

  const columnDefs = [
    {
      headerName: "Select All",
      field: "id",
      sortable: false,
      checkboxSelection: true,
      width: "80px",
      expandable: true,
      detailRenderer: (props) => {
        return (
          <section>
            <div className="cmp-product-lines-grid__row--expanded">
              <ProductLinesChildGrid data={gridData}></ProductLinesChildGrid>
            </div>
          </section>
        );
      },
    },
    {
      headerName: "Item Information",
      field: "shortDescription",
      sortable: false,
      valueFormatter: (props) => {
        return props.value;
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
    },
    {
      headerName: "Extended Price",
      field: "extendedPriceFormatted",
      sortable: false,
    },
  ];

  return (
    <section>
      <div className="cmp-product-lines-grid">
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={gridData}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesGrid;
