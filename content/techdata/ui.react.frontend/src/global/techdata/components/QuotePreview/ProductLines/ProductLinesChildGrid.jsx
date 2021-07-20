import React from "react";
import Grid from "../../Grid/Grid";

function ProductLinesChildGrid({ data }) {
  const columnDefs = [
    {
      field: "id",
      sortable: false,
      width: "80px",
      cellRenderer: (props) => {
        return (
          <section style={{ "marginLeft": "50px" }}>{props.value};</section>
        );
      },
    },
    {
      field: "shortDescription",
      sortable: false,
      valueFormatter: (props) => {
        return props.value;
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
