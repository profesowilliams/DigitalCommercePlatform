import React from "react";
import Grid from "../../Grid/Grid";

function ProductLinesChildGrid({ license, data, columns, gridProps }) {

  const cols = columns.map((col) => {
    col.field === "id" &&
      (col.cellRenderer = (props) => {
        return <section style={{ marginLeft: "60px" }}>{props.value}</section>;
      });
    delete col.expandable;
    delete col.checkboxSelection;
    delete col.headerCheckboxSelection;
    delete col.detailRenderer;

    col.field === "quantity" && delete col.cellRenderer;
    return col;
  });

  return (
    <section>
      <div className="cmp-product-lines-grid__child-grid">
        <Grid
          columnDefinition={cols}
          config={{
            ...gridProps,
            agGridLicenseKey: license,
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
