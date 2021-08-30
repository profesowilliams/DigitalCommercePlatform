import React from "react";
import Grid from "../../Grid/Grid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";
import thousandSeparator from "../../../helpers/thousandSeparator";

function ProductLinesChildGrid({ data, columns }) {
  const columnDefs = [
    {
      field: "id",
      sortable: false,
      width: "160px",
      rowClass: ({ node, data }) => "cmp-product-lines-grid__child-grid__row",
      cellRenderer: (props) => {
        return <section style={{ marginLeft: "60px" }}>{props.value}</section>;
      },
    },
    {
      field: "shortDescription",
      sortable: false,
      width: "600px",
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
      width: "120px",
    },
    {
      field: "extendedPriceFormatted",
      sortable: false,
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitPrice * data.quantity);
      },
    },
  ];

  return (
    <section>
      <div className="cmp-product-lines-grid__child-grid">
        <Grid
          columnDefinition={columnDefs}
          config={{
            columnList: columns,
            serverSide: false,
            paginationStyle: "none",
          }}
          data={data}
          showHeader={false}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesChildGrid;
