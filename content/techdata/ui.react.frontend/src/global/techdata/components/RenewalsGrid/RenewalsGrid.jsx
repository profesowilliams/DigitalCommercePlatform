import React, { useMemo, useState } from "react";
import useGridFiltering from "../../hooks/useGridFiltering";
import Grid from "../Grid/Grid";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import CustomRenewalPagination from "./CustomRenewalPagination";
import { getColumnDefinitions } from "./GenericColumnTypes";
import SearchFilter from "./SearchFilter";
import { useRenewalGridState } from "./store/RenewalsStore";

function RenewalsGrid(props) {
 
  const { onAfterGridInit, onQueryChanged, requestInterceptor } =
    useGridFiltering();
  const effects = useRenewalGridState(state => state.effects);
  const componentProp = JSON.parse(props.componentProp);
  const { searchOptionsList } = componentProp;
  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "asc",
  };

  const columnDefs = getColumnDefinitions(componentProp.columnList);
  
  const gridConfig = {
    ...componentProp,
    paginationStyle: "none",
    noRowsErrorMessage: "No data found",
    errorGettingDataMessage: "Internal server error please refresh the page",
  };

  function mapServiceData(response) {
    const mappedResponse = {...response};
    const items = mappedResponse?.data?.content?.items?.response;
    const itemsWithActions = items.map((data) => ({ ...data, actions: true }));
    // renewal server is not returning pagination yet
    mappedResponse.data.content = {items:itemsWithActions,totalItems:20 };
    return mappedResponse;
  }

  const customRequestInterceptor = async (request) => {
    const response = await requestInterceptor(request);
    // temporarely map until renewal service retorn the proper data structure
    const mappedResponse = mapServiceData(response); 
    effects.setPagination({
      currentResultsInPage: mappedResponse?.data?.content?.items.length,
      totalCounter: mappedResponse?.data?.content?.totalItems,   
      stepBy: 25,
      currentPage: 1      
    })
    return mappedResponse;
  }

  return (
    <section>
      <div className="cmp-renewals-subheader">
        <CustomRenewalPagination/>
        <div className="renewal-filters">
          <SearchFilter              
            options={searchOptionsList}
            onQueryChanged={onQueryChanged}
          />
          <VerticalSeparator />
          <RenewalFilter
            aemData={componentProp}
            onQueryChanged={onQueryChanged}
          />
        </div>
      </div>

      <div className="cmp-renewals-grid">
        <Grid         
          columnDefinition={columnDefs}
          options={options}
          config={gridConfig}
          onAfterGridInit={onAfterGridInit}
          requestInterceptor={customRequestInterceptor}        
          mapServiceData={mapServiceData}       
          isRenewals={true}   
          handlerIsRowMaster={() => true}
          icons={{
            groupExpanded: '<i class="fas fa-ellipsis-h" style="font-size: 1.3rem;"></i>',
            groupContracted: '<i class="fas fa-ellipsis-h" style="font-size: 1.3rem;"></i>',
          }}
          omitCreatedQuery={true}
        />
      </div>
    </section>
  );
}

export default RenewalsGrid;
