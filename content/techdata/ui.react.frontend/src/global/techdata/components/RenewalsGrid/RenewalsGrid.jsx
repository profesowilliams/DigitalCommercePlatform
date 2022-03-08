import React, { useMemo, useState, useEffect, useRef } from "react";
import useGridFiltering from "../../hooks/useGridFiltering";
import Grid from "../Grid/Grid";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import CustomRenewalPagination from "./CustomRenewalPagination";
import { getColumnDefinitions } from "./GenericColumnTypes";
import RenewalDetailRenderers from "./RenewalDetailRenderers";
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
    defaultSortingDirection: "desc",
  };

  useEffect(()=>effects.setCustomState({key:'aemConfig',value:componentProp}),[])

  const columnDefs = getColumnDefinitions(componentProp.columnList);
  
  const gridConfig = {
    ...componentProp,
    paginationStyle: "custom",
    noRowsErrorMessage: "No data found",
    errorGettingDataMessage: "Internal server error please refresh the page",
  };

  function mapServiceData(response) {
    const mappedResponse = {...response};
    const items = mappedResponse?.data?.content?.items?.map(val => ({...val, excelApi: componentProp?.uiServiceEndPointExcel}));
    const itemsWithActions = items ? items.map((data) => ({ ...data, actions: true })) : [];
    const totalItems = mappedResponse?.data?.content?.totalItems ?? items?.length;
    const pageCount = mappedResponse?.data?.content?.pageCount ?? 0;
    const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;
    if (mappedResponse.status !== 200 && !(mappedResponse.data)){
      return {data:{content: {items:null,totalItems,pageCount,pageNumber}}}
    }
    mappedResponse.data.content = {items:itemsWithActions,totalItems,pageCount,pageNumber};
    return mappedResponse;
  }

  const customRequestInterceptor = async (request) => {
    const response = await requestInterceptor(request);   
    const mappedResponse = mapServiceData(response);      
    const {pageCount, pageNumber, totalItems} = mappedResponse?.data?.content;
    const value = {
      currentResultsInPage: mappedResponse?.data?.content?.items?.length,
      totalCounter: totalItems,   
      pageCount,
      pageNumber          
    }
    effects.setCustomState({key:'pagination',value})
    return mappedResponse;
  }

  const _onAfterGridInit = (config) => {    
    const value =  config.api;     
    effects.setCustomState({key:'gridApi',value});      
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
            groupExpanded: '<i></i>',
            groupContracted: '<i></i>',
          }}
          omitCreatedQuery={true}
          customizedDetailedRender={RenewalDetailRenderers}
        />
      </div>
    </section>
  );
}

export default RenewalsGrid;


