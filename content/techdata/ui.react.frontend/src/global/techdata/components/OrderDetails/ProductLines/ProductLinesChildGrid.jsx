import React from "react";
import Grid from "../../Grid/Grid";

function ProductLinesChildGrid({ license, data, columns, columnDefiniton }) {
  const cols = columnDefiniton.map((col) => {
    col.field === "id" &&
      (col.cellRenderer = (props) => {
        return <section style={{ marginLeft: "32px" }}>{props.value}</section>;
      });
    col.expandable = false;
    delete col.detailRenderer;
    return col;
  });

  return (
    <section>
      <div className="cmp-product-lines-grid__child-grid">
        <Grid
          columnDefinition={cols}
          config={{
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
