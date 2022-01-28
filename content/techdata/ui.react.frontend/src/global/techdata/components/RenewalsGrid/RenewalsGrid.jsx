import React, { useMemo, useState, useEffect, useRef } from "react";
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
  const componentJustMounted = useRef(true);

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "asc",
  };

  useEffect(()=>effects.setCustomState({key:'aemConfig',value:componentProp}),[])

  const columnDefs = getColumnDefinitions(componentProp.columnList);
  
  const gridConfig = {
    ...componentProp,
    // paginationStyle: "none",
    noRowsErrorMessage: "No data found",
    errorGettingDataMessage: "Internal server error please refresh the page",
  };

  function buildDueDateAscInitialRequest(request) {
    const {url} = request;
    const sortByValue = url?.match(/SortBy=(\w+)/)[1]; // id
    const sortReplaced = url.replace(sortByValue,'dueDate') // SortBy=dueDate    
    const sortDirection = sortReplaced?.match(/SortDirection=(\w+)/)[1]; // desc
    const replaced = sortReplaced.replace(sortDirection,'asc') // SortDirection=asc
    return {...request,url:replaced}
  }

  function mapServiceData(response) {
    const mappedResponse = {...response};
    const items = mappedResponse?.data?.content?.items;
    const itemsWithActions = items.map((data) => ({ ...data, actions: true }));
    const totalItems = mappedResponse?.data?.content?.totalItems ?? items.length;
    const pageCount = mappedResponse?.data?.content?.pageCount ?? 0;
    const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;
    mappedResponse.data.content = {items:itemsWithActions,totalItems,pageCount,pageNumber};
    return mappedResponse;
  }

  const customRequestInterceptor = async (request) => {
    if (componentJustMounted.current) {
      request = buildDueDateAscInitialRequest(request);
      componentJustMounted.current = false;
    }
    const response = await requestInterceptor(request);   
    const mappedResponse = mapServiceData(response);  
    const {pageCount, pageNumber, totalItems} = mappedResponse?.data?.content;
    const value = {
      currentResultsInPage: mappedResponse?.data?.content?.items.length,
      totalCounter: totalItems,   
      pageCount,
      pageNumber          
    }
    effects.setCustomState({key:'pagination',value})
    return mappedResponse;
  }

  const _onAfterGridInit = (config) => {    
    effects.setCustomState({key:'gridApi',value:config});      
    onAfterGridInit(config);
  }

  return (
    <section>     
      <div className="cmp-renewals-subheader">
        <CustomRenewalPagination />
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
          onAfterGridInit={_onAfterGridInit}
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


