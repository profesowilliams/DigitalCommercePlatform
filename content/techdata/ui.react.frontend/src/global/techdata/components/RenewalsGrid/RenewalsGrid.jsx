import React, { useEffect, useRef } from "react";
import { LOCAL_STORAGE_KEY_USER_DATA, TOASTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import { thousandSeparator } from "../../helpers/formatting";
import { useMultiFilterSelected } from "../RenewalFilter/hooks/useFilteringState";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
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
  getContextMenuItems,
} from "./utils/renewalUtils";
import { useRenewalGridState } from "./store/RenewalsStore";
import shallow from 'zustand/shallow';
import { SORT_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { setDefaultSearchDateRange } from "../../../../utils/utils";
import { setLocalStorageData, hasLocalStorageData, getLocalStorageData } from "./utils/renewalUtils";
import useRenewalFiltering from "../RenewalFilter/hooks/useRenewalFiltering";
import { isAuthormodeAEM } from "../../../../utils/featureFlagUtils";
import Toaster from "../Widgets/Toaster";
import TransactionNumber from "./Orders/TransactionNumber";
import { renewalsDefinitions } from "./utils/renewalsDefinitions";
import BaseGrid from "../BaseGrid/BaseGrid";
import BaseGridHeader from "../BaseGrid/BaseGridHeader";
import RenewalSearch from "../BaseGrid/Search/Search";
import CopyFlyout from "../CopyFlyout/CopyFlyout";
import BaseGridPagination from "../BaseGrid/Pagination/BaseGridPagination";
import useExtendGridOperations from "../BaseGrid/Hooks/useExtendGridOperations";
import ToolTip from './../BaseGrid/ToolTip';

const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));

function RenewalsGrid(props) {
  const { onAfterGridInit, onQueryChanged, handleQueryFlowLogic, resetGrid } = useExtendGridOperations(useRenewalGridState);
  const effects = useRenewalGridState(state => state.effects);
  const gridApiRef = useRef();
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

  const defaultSearchDateRange = setDefaultSearchDateRange(30);

  const customPaginationRef = useRef();

  const renewalsRef = useRef();

  const searchCriteria = useRef({field:'',value:''});

  const toolTipData = useRenewalGridState(state => state.toolTipData, shallow);

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

    const renewalsNode = renewalsRef.current;
    const parentRenewalsStyle = renewalsNode?.parentNode?.parentNode?.parentNode;
    const isTDSynnex = parentRenewalsStyle?.classList.contains("cmp-grid-td-synnex");
    const isTechdata = parentRenewalsStyle?.classList.contains("cmp-grid-techdata");
    let branding = isTDSynnex ? 'td-synnex' : (isTechdata ? 'cmp-grid-techdata' : '');
    setCustomState({ key: 'branding', value: branding });

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
    const renewalPlanItem = sortedModel.find(x => x.colId === 'renewedduration');
    if(renewalPlanItem) {
      sortedModel.push({...renewalPlanItem, colId: 'support'});
    }
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
        return event.data.reseller.name + " [" + event.data.reseller.id + "]";
      case "vendor":
        return `${event.value.name}: ${event.data.programName}`
      default:
        return event.value?.name;
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

  const contextMenuItems = (params) => getContextMenuItems(params, gridConfig);
 
  return (
    <section ref={renewalsRef} id="renewals-grid-component">
      <BaseGridHeader
        leftComponents={[
          <BaseGridPagination
            onQueryChanged={onQueryChanged}
            ref={customPaginationRef}
            store={useRenewalGridState}
          />
        ]}
        rightComponents={[
          <RenewalSearch
            options={searchOptionsList}
            onQueryChanged={onQueryChanged}
            ref={searchCriteria}
            store={useRenewalGridState}
          />,
          <VerticalSeparator />,
          <RenewalFilter
            aemData={componentProp}
            onQueryChanged={onQueryChanged}
          />
        ]}
      />      
      <BaseGrid
        columnList={componentProp.columnList}
        definitions={renewalsDefinitions()}
        config={gridConfig}
        options={options}
        gridConfig={gridConfig}
        onAfterGridInit={_onAfterGridInit}
        requestInterceptor={customRequestInterceptor}
        mapServiceData={mapServiceData}
        onSortChanged={onSortChanged}
        handlerIsRowMaster={() => true}
        icons={{groupExpanded: "<i></i>",groupContracted: "<i></i>",}}
        DetailRenderers={RenewalDetailRenderers}
        onCellMouseOver={cellMouseOver}
        onCellMouseOut={cellMouseOut}
        omitCreatedQuery={true}
        contextMenuItems={contextMenuItems}
        defaultSearchDateRange={defaultSearchDateRange}
        noContextMenuItemsWhenColumnNull={true} />
      <ToolTip toolTipData={toolTipData}/>
      <div className="cmp-renewals__pagination--bottom">
        <BaseGridPagination
            onQueryChanged={onQueryChanged}
            ref={customPaginationRef}
            store={useRenewalGridState}
          />
      </div>
      <Toaster
        onClose={onCloseToaster}
        store={useRenewalGridState} 
        message={{successSubmission:'successSubmission', failedSubmission:'failedSubmission'}}/>
      <CopyFlyout 
        store={useRenewalGridState}
        copyFlyout={gridConfig.copyFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        resetGrid={resetGrid} />
    </section>
  );
}

export default RenewalsGrid;



