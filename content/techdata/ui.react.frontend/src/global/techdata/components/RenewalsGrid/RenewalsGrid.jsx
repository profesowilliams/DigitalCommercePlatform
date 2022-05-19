import React, { useEffect, useRef } from "react";
import { LOCAL_STORAGE_KEY_USER_DATA } from "../../../../utils/constants";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import { thousandSeparator } from "../../helpers/formatting";
import useGridFiltering from "../../hooks/useGridFiltering";
import Grid from "../Grid/Grid";
import { useMultiFilterSelected } from "../RenewalFilter/hooks/useFilteringState";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import CustomRenewalPagination from "./Navigation/CustomRenewalPagination";
import { getColumnDefinitions } from "./Columns/GenericColumnTypes";
import RenewalDetailRenderers from "./Columns/RenewalDetailRenderers";
import {
  addCurrentPageNumber, isFilterPostRequest,
  mapServiceData, secondLevelOptions,
  mapSortIdByPrice,
  nonFilteredOnSorting, preserveFilterinOnSorting,
  setPaginationData, isFirstTimeSortParameters
} from "./renewalUtils";
import SearchFilter from "./Search/SearchFilter";
import { useRenewalGridState } from "./store/RenewalsStore";
import shallow from 'zustand/shallow'
import useRenewalFiltering from "../RenewalFilter/hooks/useRenewalFiltering";

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
  const { onAfterGridInit, onQueryChanged, handleQueryFlowLogic } = useRenewalFiltering();
  const effects = useRenewalGridState(state => state.effects);
  const gridApiRef = useRef();
  const toolTipData = useRenewalGridState(state => state.toolTipData, shallow);
  const renewalOptionState = useRenewalGridState(state => state.renewalOptionState);


  const { setToolTipData, setCustomState } = effects;

  const componentProp = JSON.parse(props.componentProp);
  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;

  const hasSortChanged = useRef(false);

  const previousSortChanged = useRef(false);

  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();

  const previousFilter = useRef(false);

  const { searchOptionsList, shopURL } = componentProp;

  const customPaginationRef = useRef();

  const searchCriteria = useRef({field:'',value:''});

  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "desc",
  };
 
  const redirectToShop = () => {
    if(!shopURL) return;
    window.location = shopURL;
  };

  useEffect(() => setCustomState({ key: 'aemConfig', value: componentProp }), [])

  useEffect(() => {
    // In case of don't have access redirect to shop
    if(process.env.NODE_ENV === "development") return;
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
    let {initialRequest} = handleQueryFlowLogic()  
    if (mapSortIdByPrice(secondLevelOptions, gridApiRef, request)) return;
    request.url = addCurrentPageNumber(customPaginationRef, request);
    let response = {};
    if (isFilterPostRequest(hasSortChanged,isFilterDataPopulated)){
      response = await preserveFilterinOnSorting({hasSortChanged,isFilterDataPopulated,optionFieldsRef,customPaginationRef,componentProp, previousFilter});
    } else {      
      response = await nonFilteredOnSorting({request, hasSortChanged, searchCriteria, customPaginationRef, previousSortChanged, initialRequest});  
    } 
    const mappedResponse = mapServiceData(response);
    const { refinementGroups, ...rest } = mappedResponse?.data?.content;
    const pageSize = gridConfig.itemsPerPage;
    const paginationValue = setPaginationData(rest,pageSize);

    if (response.data.content.pageCount === response.data.content.pageNumber)
      gridApiRef?.current.api.paginationSetPageSize(response.data.content.items.length);

    setCustomState({ key: 'pagination', value: paginationValue })
    setCustomState({ key: 'refinements', value: refinementGroups })
    return mappedResponse;
  }

  const onSortChanged = (evt) => {
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList.filter(o => !!o.sort);   
    hasSortChanged.current = sortedModel ? { sortData: sortedModel } : false;  
    const testRef =  sortedModel ? { sortData: sortedModel } : false;
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
    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current, secondLevelOptions)
    const columnState =  {
      state: isDefaultSort ? [
        {
          colId: dueDateKey,
          sort: dueDateDir,
        },
        { ...secondLevelOptions },
      ] : [...hasSortChanged.current.sortData],
      defaultState: { sort: null },
    }
    config.columnApi.applyColumnState({...columnState})
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

  const getDefaultCopyValue = (params) => {
    const colId = params?.column?.colId;
    const nodeData = params?.node?.data
    switch (colId) {
      case "resellername":
        return nodeData?.reseller?.name;
      case "Id":
        return nodeData?.source?.id;
      case "renewedduration":
        return `${nodeData?.source?.type}: ${nodeData?.programName}`
      case "total":
        return thousandSeparator(nodeData?.renewal?.total);
      default:
        return "";
    }
  }

  /**
   * A custom implementation to enable tooltips on hover
   * for those columns whose values are truncated. Modify `hoverableList`
   * in `GenericColumnTypes.jsx` to enable hover for more columns.
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
          getDefaultCopyValue={getDefaultCopyValue}
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


