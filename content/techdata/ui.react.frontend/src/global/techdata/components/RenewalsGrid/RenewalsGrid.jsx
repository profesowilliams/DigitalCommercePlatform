import React from "react";
import Grid from "../Grid/Grid";
import { getColumnDefinitions } from "./GenericColumnTypes";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import { IS_TD_INTERNAL } from "../../../../utils/user-utils";

function ConfigurationGrid(props) {
  const componentProp = JSON.parse(props.componentProp);

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "asc",
  };

  const columnDefs = getColumnDefinitions(componentProp.columnList);

  return (
    <section>
      <RenewalFilter aemData={componentProp}/>
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
