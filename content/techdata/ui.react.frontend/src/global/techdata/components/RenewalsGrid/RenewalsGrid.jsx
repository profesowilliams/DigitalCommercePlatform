import React, { useEffect, useRef } from "react";
import { LOCAL_STORAGE_KEY_USER_DATA, TOASTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import { thousandSeparator } from "../../helpers/formatting";
import Grid from "../Grid/Grid";
import { useMultiFilterSelected } from "../RenewalFilter/hooks/useFilteringState";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import CustomRenewalPagination from "./Navigation/CustomRenewalPagination";
import { getColumnDefinitions } from "./Columns/GenericColumnTypes";
import RenewalDetailRenderers from "./Columns/RenewalDetailRenderers";
import {
  addCurrentPageNumber,
  mapServiceData,
  setPaginationData,
  isFirstTimeSortParameters,
  clearLocalStorageGridData,
  isFromRenewalDetailsPage,
  updateQueryString,
  handleFetchDataStrategy,
  formatRenewedDuration,
} from "./renewalUtils";
import SearchFilter from "./Search/SearchFilter";
import { useRenewalGridState } from "./store/RenewalsStore";
import shallow from 'zustand/shallow';
import { SORT_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { setLocalStorageData, hasLocalStorageData, getLocalStorageData } from "./renewalUtils";
import useRenewalFiltering from "../RenewalFilter/hooks/useRenewalFiltering";
import { isAuthormodeAEM } from "../../../../utils/featureFlagUtils";
import Toaster from "../Widgets/Toaster";
import TransactionNumber from "./Orders/TransactionNumber";
import { removeDashboardSeparator } from "../../../../utils/utils";

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
  const firstAPICall = useRef(true);
  
  const { setToolTipData, setCustomState, closeAndCleanToaster } = effects;

  const componentProp = JSON.parse(props.componentProp);
  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;

  const hasSortChanged = useRef(false);

  const previousSortChanged = useRef(false);

  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();

  const previousFilter = useRef(false);

  const { searchOptionsList, shopURL, icons } = componentProp;

  const customPaginationRef = useRef();

  const renewalsRef = useRef();

  const searchCriteria = useRef({field:'',value:''});

  let options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "desc",
  };

  let secondLevelOptions = {
    colId: 'total',
    sort: "desc",
  }

  if (hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) && isFromRenewalDetailsPage()) {
    options.defaultSortingColumnKey = getLocalStorageData(SORT_LOCAL_STORAGE_KEY).colId;
    options.defaultSortingDirection = getLocalStorageData(SORT_LOCAL_STORAGE_KEY).sort;
    secondLevelOptions.colId = null;
    secondLevelOptions.sort = null;
  }

  if (hasLocalStorageData(TOASTER_LOCAL_STORAGE_KEY) && isFromRenewalDetailsPage()) {
    const toasterData = getLocalStorageData(TOASTER_LOCAL_STORAGE_KEY);
    const transactionNumber = toasterData.Child?.props?.data;
    toasterData.Child = <TransactionNumber data={transactionNumber}/>   
    setTimeout(() => setCustomState({key:'toaster', value:toasterData}), 800);
  }

  const redirectToShop = () => {
    if(!shopURL) return;
    window.location = shopURL;
  };

  const isPriceColumnClicked = useRef(false);

  useEffect(() => {
    const catchPriceColumnClickEvent = (e) => {
      e.stopPropagation();
      const innerText = e.target.innerText || e.target.closest(".ag-header-cell-label")?.innerText;
      isPriceColumnClicked.current = innerText?.includes('Price');    
    }
    window.addEventListener("click", catchPriceColumnClickEvent);
    removeDashboardSeparator(".renewalsgrid")
    const renewalsNode = renewalsRef.current;
    const containsTDSynnexClass = renewalsNode?.parentNode?.parentNode?.parentNode?.classList.contains("cmp-grid-td-synnex");
    if (containsTDSynnexClass) {
      setCustomState({key:'isTDSynnex', value:true});
    }   
    return () => window.removeEventListener("click",catchPriceColumnClickEvent);
  },[])

  useEffect(() => setCustomState({ key: 'aemConfig', value: componentProp }), [])

  useEffect(() => setCustomState({ key: 'dueDaysIcons', value: icons }), [])

  useEffect(() => {
    // In case of don't have access redirect to shop
    if(process.env.NODE_ENV === "development") return;
    if(isAuthormodeAEM()) return; // Validation for Author ENV
    // Only redirect if the user has logged in and lacks the access. Otherwise wait for the login to finish before evaluating
    (!hasAccess({ user: USER_DATA, accessType: ACCESS_TYPES.RENEWALS_ACCESS }) &&
    !hasAccess({ user: USER_DATA, accessType: ACCESS_TYPES.CAN_ACCESS_RENEWALS }))
    && (!!USER_DATA && redirectToShop())
  }, [
    USER_DATA,
    ACCESS_TYPES,
    hasAccess,
    isAuthormodeAEM
  ]);

  const columnDefs = getColumnDefinitions(componentProp.columnList);

  var distiColumnIndex = columnDefs.findIndex(c => c.field === 'Id');
  if (distiColumnIndex > -1) {
    columnDefs[distiColumnIndex] = {
      ...columnDefs[distiColumnIndex],
      cellStyle: {'text-overflow':'initial','white-space':'nowrap', 'overflow': 'visible', 'padding': 0},
    };
  }

  var totalColumnIndex = columnDefs.findIndex(c => c.field === 'total');
  if (totalColumnIndex > -1) {
    columnDefs[totalColumnIndex] = {
      ...columnDefs[totalColumnIndex],
      cellStyle: {'text-overflow':'initial','white-space':'nowrap', 'overflow': 'visible', 'padding': 0},
    };
  }

  const gridConfig = {
    ...componentProp,
    paginationStyle: "custom",
    noRowsErrorMessage: "No data found",
    errorGettingDataMessage: "Internal server error please refresh the page",
  };

  const customRequestInterceptor = async (request) => {
    const { onFiltersClear, onSearchAction } = handleQueryFlowLogic();
    request.url = addCurrentPageNumber(customPaginationRef, request);
    let response = {};
    const gridApi = gridApiRef?.current?.api;
    const renewalOperations = {
      hasSortChanged,
      isFilterDataPopulated,
      optionFieldsRef,
      customPaginationRef,
      componentProp,
      onSearchAction,
      searchCriteria,
      previousFilter,
      request,
      previousSortChanged,
      onFiltersClear,
      firstAPICall,
      isPriceColumnClicked,
      gridApiRef
    }
    response = await handleFetchDataStrategy(renewalOperations)
    const mappedResponse = mapServiceData(response);
    const { refinementGroups, ...rest } = mappedResponse?.data?.content;
    const pageSize = gridConfig.itemsPerPage;
    const paginationValue = setPaginationData(rest,pageSize);
    const responseContent = response?.data?.content;
    const pageNumber = responseContent?.pageNumber;

    if (responseContent?.pageCount === pageNumber)
      gridApi.paginationSetPageSize(responseContent?.items?.length);

    updateQueryString(pageNumber);

    setCustomState({ key: 'pagination', value: paginationValue }, {
      key: PAGINATION_LOCAL_STORAGE_KEY,
      saveToLocal: true,
    })
    if (refinementGroups) {
      setCustomState({ key: 'refinements', value: refinementGroups });
    }

    return mappedResponse;
  }

  const onSortChanged = (evt) => {
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList.filter(o => !!o.sort).map( ({colId, sort }) => ({colId, sort}));
    hasSortChanged.current = sortedModel ? { sortData: sortedModel } : false;  
    setLocalStorageData(SORT_LOCAL_STORAGE_KEY, hasSortChanged.current); 
    const sortingEventFilter = evt?.columnApi?.getColumnState().filter(val => val.sort)
    if (sortingEventFilter.length === 1) {
      pushEvent(ANALYTICS_TYPES.events.click, {
        type: ANALYTICS_TYPES.types.button,
        category: ANALYTICS_TYPES.category.renewalsTableInteraction,
        name: sortingEventFilter?.[0]?.colId,
      });
    }
  };

  useEffect(() => {
    if (hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) && isFromRenewalDetailsPage()) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
  }, [])

  useEffect(() => {
    if(!isFromRenewalDetailsPage()) {
      clearLocalStorageGridData();
    }
  }, []);

  const _onAfterGridInit = (config) => {
    const value = config.api;
    setCustomState({ key: 'gridApi', value });
    gridApiRef.current = config;
    onAfterGridInit(config);    
    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current)
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
        return formatRenewedDuration(event.data.source.type, event.data.renewedDuration, event.data.support);
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

  function onCloseToaster() {
    closeAndCleanToaster();    
  }

  return (
    <section ref={renewalsRef}>      
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
      <Toaster
        onClose={onCloseToaster}
        store={useRenewalGridState} 
        message={{successSubmission:'successSubmission', failedSubmission:'failedSubmission'}}/>
    </section>
  );
}

export default RenewalsGrid;


