import React from "react";
import Grid from "../Grid/Grid";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import DropdownFilter from "./DropdownFilter";
import { RENEWALS } from "./FilterOptions";
import { getColumnDefinitions } from "./GenericColumnTypes";



function ConfigurationGrid(props) {
  const componentProp = JSON.parse(props.componentProp);
  VerticalSeparator
  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "asc",
  };

  const columnDefs = getColumnDefinitions(componentProp.columnList);

  const gridConfig = {
    ...componentProp,  
    paginationStyle: "none", 
  };

  return (
    <section>
      <div className="cmp-renewals-subheader">
        <div className="navigation">
          <p>26-50 of 108 results</p>
          <p>{'<'} 2 of 3 {'>'}</p>
        </div>
        <div className="renewal-filters">
          <div className="cmp-renewal-search">
              <DropdownFilter
                options={RENEWALS}
                
              />
          </div>
          <VerticalSeparator/>
          <div className="cmp-renewal-filter">
            <RenewalFilter aemData={componentProp} />
          </div>
        </div>

      </div>

      <div className="cmp-renewals-grid">
        <Grid
          columnDefinition={columnDefs}
          options={options}
          config={gridConfig}
        ></Grid>
      </div>
    </section>
  );
}

export default ConfigurationGrid;
