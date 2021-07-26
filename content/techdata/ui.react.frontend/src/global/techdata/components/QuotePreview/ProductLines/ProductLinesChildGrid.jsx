import React from "react";
import Grid from "../../Grid/Grid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";

function ProductLinesChildGrid({ data }) {
  const columnDefs = [
    {
      field: "id",
      sortable: false,
      width: "80px",
      rowClass: ({ node, data }) => "cmp-product-lines-grid__child-grid__row",
      cellRenderer: (props) => {
        return <section style={{ marginLeft: "60px" }}>{props.value}</section>;
      },
    },
    {
      field: "shortDescription",
      sortable: false,
      cellHeight: () => 80,
      cellRenderer: (props) => {
        return <ProductLinesItemInformation line={props.data} />;
      },
    },
    {
      field: "unitListPriceFormatted",
      sortable: false,
    },
    {
      field: "quantity",
      sortable: false,
    },
    {
      field: "extendedPriceFormatted",
      sortable: false,
    },
  ];

  return (
    <section>
      <div className="cmp-product-lines-grid__child-grid">
        <Grid
          columnDefinition={columnDefs}
          config={{ serverSide: false, paginationStyle: "none" }}
          data={data}
          showHeader={false}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesChildGrid;
