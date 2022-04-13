import React, { useEffect, useRef, useState } from "react";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";
import useGridFiltering from "../../hooks/useGridFiltering";
import Grid from "../Grid/Grid";
import { useMultiFilterSelected } from "../RenewalFilter/hooks/useFilteringState";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import CustomRenewalPagination from "./CustomRenewalPagination";
import { getColumnDefinitions } from "./GenericColumnTypes";
import RenewalDetailRenderers from "./RenewalDetailRenderers";
import { isFilterPostRequest, mapServiceData, mapSortIdByPrice, preserveFilteringOnPagination, preserveFilterinOnSorting, priceDescendingByDefaultHandle, setPaginationData } from "./renewalUtils";
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

  const hasSortChanged = useRef(false);

  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();

  const { searchOptionsList } = componentProp;

  const customPaginationRef = useRef();

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "desc",
  };
  const secondLevelOptions = {
    colId: 'total',
    sort: "desc",
  }

  useEffect(() => effects.setCustomState({ key: 'aemConfig', value: componentProp }), [])

  const columnDefs = getColumnDefinitions(componentProp.columnList);

  const gridConfig = {
    ...componentProp,
    paginationStyle: "custom",
    noRowsErrorMessage: "No data found",
    errorGettingDataMessage: "Internal server error please refresh the page",
  };

  const customRequestInterceptor = async (request) => {
    const sortingFields = { dueDateKey, dueDateDir, secondLevelOptions };
    if (mapSortIdByPrice(secondLevelOptions, gridApiRef, request)) return;
    request.url = preserveFilteringOnPagination(customPaginationRef, request);
    let response = {};
    if (isFilterPostRequest(hasSortChanged,isFilterDataPopulated)){
      response = await preserveFilterinOnSorting({hasSortChanged,isFilterDataPopulated,optionFieldsRef,customPaginationRef,componentProp});
    } else {
      response = await requestInterceptor(request);
    }  
    const mappedResponse = mapServiceData(response);
    const { refinementGroups, ...rest } = mappedResponse?.data?.content;
    const paginationValue = setPaginationData(rest);
    effects.setCustomState({ key: 'pagination', value: paginationValue })
    effects.setCustomState({ key: 'refinements', value: refinementGroups })
    mappedResponse.data.content.items = priceDescendingByDefaultHandle(
      sortingFields,
      mappedResponse
    );
    return mappedResponse;
  }

  const onSortChanged = (evt) => {
    const sortModelList = evt.columnApi.getColumnState();
    const sortWithDirectionList = sortModelList.filter(o => !!o.sort);
    const sortedModel = sortWithDirectionList[0]; 
    hasSortChanged.current = sortedModel ? { sortData: sortedModel } : false;
    const sortingEventFilter = evt?.columnApi?.getColumnState().filter(val => val.sort)
    if (sortingEventFilter.length === 1) {
      pushEvent(ANALYTICS_TYPES.events.click, {
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.renewalsTableInteraction,
        name: sortingEventFilter?.[0]?.colId,
      });
    }
  };

  const _onAfterGridInit = (config) => {
    const value = config.api;
    effects.setCustomState({ key: 'gridApi', value });
    gridApiRef.current = config;
    onAfterGridInit(config);
    config.columnApi.applyColumnState({
      state: [
        {
          colId: dueDateKey,
          sort: dueDateDir,
        },
        { ...secondLevelOptions },
      ],
      defaultState: { sort: null },
    })
  }

  return (
    <section>
      <div className="cmp-renewals-subheader">
        <CustomRenewalPagination onQueryChanged={onQueryChanged} ref={customPaginationRef} />
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


