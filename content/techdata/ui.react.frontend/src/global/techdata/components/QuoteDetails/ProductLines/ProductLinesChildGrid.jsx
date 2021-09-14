import React from "react";
import Grid from "../../Grid/Grid";

function ProductLinesChildGrid({ data, columns, columnDefiniton, ...rest }) {
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
            columnList: columns,
            serverSide: false,
            paginationStyle: "none",
          }}
          data={data}
          showHeader={false}
          {...rest}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesChildGrid;
