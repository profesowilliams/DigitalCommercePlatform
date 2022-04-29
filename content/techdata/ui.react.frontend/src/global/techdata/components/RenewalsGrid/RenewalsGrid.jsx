import React, { useEffect, useRef } from "react";
import { LOCAL_STORAGE_KEY_USER_DATA } from "../../../../utils/constants";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import useGridFiltering from "../../hooks/useGridFiltering";
import Grid from "../Grid/Grid";
import { useMultiFilterSelected } from "../RenewalFilter/hooks/useFilteringState";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import CustomRenewalPagination from "./CustomRenewalPagination";
import { getColumnDefinitions } from "./GenericColumnTypes";
import RenewalDetailRenderers from "./RenewalDetailRenderers";
import { isFilterPostRequest, mapServiceData, mapSortIdByPrice, nonFilteredOnSorting, addCurrentPageNumber, preserveFilterinOnSorting, priceDescendingByDefaultHandle, setPaginationData } from "./renewalUtils";
import SearchFilter from "./SearchFilter";
import { useRenewalGridState } from "./store/RenewalsStore";

function ToolTip({ toolTipData }) {
  return (
    toolTipData.show ? (
      <div
        style={{ top: toolTipData.y, left: toolTipData.x }}
        className="renewals-grid__custom-tooltip"
      >
        {toolTipData.value || ''}
      </div>
    ) : <div></div>
  );
}

const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));

function RenewalsGrid(props) {
  const { onAfterGridInit, onQueryChanged } = useGridFiltering();
  const effects = useRenewalGridState(state => state.effects);
  const gridApiRef = useRef();
  const toolTipData = useRenewalGridState(state => state.toolTipData);
  
  const { setToolTipData, setCustomState } = effects;

  const componentProp = JSON.parse(props.componentProp);
  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;

  const hasSortChanged = useRef(false);

  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();

  const { searchOptionsList, shopURL } = componentProp;

  const customPaginationRef = useRef();

  const searchCriteria = useRef({field:'',value:''});

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "desc",
  };
  const secondLevelOptions = {
    colId: 'total',
    sort: "desc",
  }

  const redirectToShop = () => {
    window.location = shopURL;
  };

  useEffect(() => setCustomState({ key: 'aemConfig', value: componentProp }), [])

  useEffect(() => {
    // In case of don't have access redirect to shop
    !hasAccess({user: USER_DATA, accessType: ACCESS_TYPES.RENEWALS_ACCESS}) && redirectToShop()
  }, [USER_DATA, ACCESS_TYPES]);

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
    request.url = addCurrentPageNumber(customPaginationRef, request);
    let response = {};
    if (isFilterPostRequest(hasSortChanged,isFilterDataPopulated)){
      response = await preserveFilterinOnSorting({hasSortChanged,isFilterDataPopulated,optionFieldsRef,customPaginationRef,componentProp});
    } else {
      response = await nonFilteredOnSorting({request, hasSortChanged, searchCriteria});  
    } 
    const mappedResponse = mapServiceData(response);
    const { refinementGroups, ...rest } = mappedResponse?.data?.content;
    const pageSize = gridConfig.itemsPerPage;
    const paginationValue = setPaginationData(rest,pageSize);
    setCustomState({ key: 'pagination', value: paginationValue })
    setCustomState({ key: 'refinements', value: refinementGroups })
    return mappedResponse;
  }

  const onSortChanged = (evt) => {
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList.filter(o => !!o.sort);
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
    setCustomState({ key: 'gridApi', value });
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

  function tootltipVal(event) {
    switch (event.colDef.field) {
      case "renewedduration":
        return `${event.data.source.type}: ${event.data.support}`
      case "resellername":
        return event.data.reseller.name;
      case "vendor":
        return `${event.value.name}: ${event.data.programName}`
      default:
        return event.value?.name;
    }
  }

  /**
   * A custom implementation to enable tooltips on hover
   * for those columns whose values are truncated. This is
   * enabled only for `endUser` column for now. Modify `hoverableList`
   * in `GenericColumnTypes.jsx` to enable for more columns.
   * @param {*} event
   */
  function cellMouseOver(event) {
    const offset = 2; // offset to maintain a distance between mouse pointer & tooltip.
    setToolTipData({
      value: tootltipVal(event),
      x: event?.event?.pageX + offset,
      y: event?.event?.pageY + offset,
      show: event?.colDef?.hoverable,
    });
  }

  function cellMouseOut() {
    setToolTipData({
      value: '',
      x: 0,
      y: 0,
      show: false,
    });
  }

  return (
    <section>
      <div className="cmp-renewals-subheader">
        <CustomRenewalPagination
          onQueryChanged={onQueryChanged}
          ref={customPaginationRef}
        />
        <div className="renewal-filters">
          <SearchFilter
            options={searchOptionsList}
            onQueryChanged={onQueryChanged}
            ref={searchCriteria}
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
            groupExpanded: "<i></i>",
            groupContracted: "<i></i>",
          }}
          onCellMouseOver={cellMouseOver}
          onCellMouseOut={cellMouseOut}
          omitCreatedQuery={true}
          customizedDetailedRender={RenewalDetailRenderers}
          suppressPaginationPanel={true}
        />
      </div>
      <ToolTip toolTipData={toolTipData} />
      <div className="cmp-renewals__pagination--bottom">
        <CustomRenewalPagination
            onQueryChanged={onQueryChanged}
            ref={customPaginationRef}
          />
      </div>
    </section>
  );
}

export default RenewalsGrid;


