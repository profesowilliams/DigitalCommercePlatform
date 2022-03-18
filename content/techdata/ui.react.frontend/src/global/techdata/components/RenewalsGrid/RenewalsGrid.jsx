import React, { useEffect, useRef } from "react";
import { pushEvent, ANALYTICS_TYPES } from "../../../../utils/dataLayerUtils";
import { sortRenewalObjects } from "../../../../utils/utils";
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
  const gridApiRef = useRef();

  const componentProp = JSON.parse(props.componentProp);
  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;
  const { searchOptionsList } = componentProp;

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "desc",
  };
  const secondLevelOptions = {
    colId: 'total',
    sort: "desc",
  }

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
    const items = mappedResponse?.data?.content?.items?.map(val => ({ ...val }));
    const itemsWithActions = items ? items.map((data) => ({ ...data, actions: true })) : [];
    const totalItems = mappedResponse?.data?.content?.totalItems ?? items?.length;
    const pageCount = mappedResponse?.data?.content?.pageCount ?? 0;
    const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;
    const refinementGroups = mappedResponse?.data?.content?.refinementGroups ?? "thomas";

    if (mappedResponse.status !== 200 && !mappedResponse.data) {
      return {
        data: {
          content: {
            items: null,
            totalItems,
            pageCount,
            pageNumber,
            refinementGroups,
          },
        },
      };
    }

    mappedResponse.data.content = {
      items: itemsWithActions,
      totalItems,
      pageCount,
      pageNumber,
      refinementGroups,
    };
    return mappedResponse;
  }

  const customRequestInterceptor = async (request) => {    
    if (request.url.includes("SortBy=id")){
      gridApiRef.current.columnApi.applyColumnState({
        state: [{ ...secondLevelOptions, sort:"asc"}],defaultState: { sort: null }
      });
      return      
    }       
    const sortModel = [{colId: dueDateKey,sort: dueDateDir},{...secondLevelOptions}];    
    const query = {
      SortBy: `${sortModel?.[0]?.colId ?? 'id'} ${sortModel?.[0]?.sort ?? ''}${sortModel?.[1]? ',': ''} ${sortModel?.[1]?.colId ?? ''} ${sortModel?.[1]?.sort ?? ''}`,
      SortDirection: sortModel?.[0]?.sort ?? ''
    }
    const response = await requestInterceptor(request);
    const mappedResponse = mapServiceData(response);      
    const {pageCount, pageNumber, totalItems, refinementGroups} = mappedResponse?.data?.content;
    const value = {
      currentResultsInPage: mappedResponse?.data?.content?.items?.length,
      totalCounter: totalItems,   
      pageCount,
      pageNumber,    
    };
    const multiSorting = sortRenewalObjects(mappedResponse?.data?.content?.items, query) ?? 0;
    effects.setCustomState({key:'pagination',value})
    effects.setCustomState({key:'refinements', value: refinementGroups})    
    mappedResponse.data.content.items = [...multiSorting];
    return mappedResponse;
  }

  const onSortChanged = (evt) => {
    const clickedColumn = evt?.columnApi
    ?.getAllGridColumns()
    .map(({ colId, sort }) => ({ colId, sort }))
    .filter((col) => col.sort)
    if(clickedColumn.length) {
      pushEvent(ANALYTICS_TYPES.events.click, {
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.renewalsTableInteraction,
        name: clickedColumn[0]?.colId,
      });
    }
  };

  const _onAfterGridInit = (config) => {    
    const value =  config.api;     
    effects.setCustomState({key:'gridApi',value});      
    gridApiRef.current = config;  
    onAfterGridInit(config);
    config.columnApi.applyColumnState({
      state: [         
        {
          colId: dueDateKey,
          sort: dueDateDir,
        },
        {...secondLevelOptions},
                 
      ],
      defaultState: { sort: null },
    })
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
          onSortChanged={onSortChanged}
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


