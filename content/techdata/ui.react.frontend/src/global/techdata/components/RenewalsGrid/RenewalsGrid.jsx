import React, { useState } from "react";
import Grid from "../Grid/Grid";
import { getColumnDefinitions } from "./GenericColumnTypes";

function ConfigurationGrid(props) {
  const componentProp = JSON.parse(props.componentProp);

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "asc",
  };

  const columnDefs = getColumnDefinitions(componentProp.columnList);

  return (
    <section>
      <div className="cmp-renewals-grid">
        <Grid
          columnDefinition={columnDefs}
          options={options}
          config={componentProp}
        ></Grid>
      </div>
    </section>
  );
}

export default ConfigurationGrid;
