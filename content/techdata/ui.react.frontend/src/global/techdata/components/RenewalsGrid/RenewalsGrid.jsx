import React, { useEffect, useRef, useState } from "react";
import { LOCAL_STORAGE_KEY_USER_DATA, TOASTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { ACCESS_TYPES, hasAccess } from '../../../../utils/user-utils';
import { useMultiFilterSelected } from '../RenewalFilter/hooks/useFilteringState';
import RenewalFilter from '../RenewalFilter/RenewalFilter';
import RenewalImport from '../RenewalImport/RenewalImport';
import ImportFlyout from '../ImportFlyout/ImportFlyout';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import RenewalDetailRenderers from './Columns/RenewalDetailRenderers';
import {
  addCurrentPageNumber,
  mapServiceData,
  setPaginationData,
  isFirstTimeSortParameters,
  clearLocalStorageGridData,
  clearLocalStorageFilterData,
  isFromRenewalDetailsPage,
  updateQueryString,
  handleFetchDataStrategy,
  formatRenewedDuration,
  getContextMenuItems,
  copyToClipboardAction,
} from './utils/renewalUtils';
import { useRenewalGridState } from './store/RenewalsStore';
import shallow from 'zustand/shallow';
import {
  SORT_LOCAL_STORAGE_KEY,
  PAGINATION_LOCAL_STORAGE_KEY,
} from '../../../../utils/constants';
import { setDefaultSearchDateRange } from '../../../../utils/utils';
import {
  setLocalStorageData,
  hasLocalStorageData,
  getLocalStorageData,
  compareSort,
} from './utils/renewalUtils';
import {
  isAuthormodeAEM,
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';
import Toaster from '../Widgets/Toaster';
import TransactionNumber from './Orders/TransactionNumber';
import { renewalsDefinitions } from './utils/renewalsDefinitions';
import BaseGrid from '../BaseGrid/BaseGrid';
import BaseGridHeader from '../BaseGrid/BaseGridHeader';
import RenewalSearch from '../BaseGrid/Search/Search';
import CopyFlyout from '../CopyFlyout/CopyFlyout';
import ShareFlyout from '../ShareFlyout/ShareFlyout';
import NewPurchaseFlyout from '../NewPurchaseFlyout/NewPurchaseFlyout';
import RevisionFlyout from '../RevisionFlyout/RevisionFlyout';
import RequestFlyout from '../RequestFlyout/RequestFlyout';
import BaseGridPagination from '../BaseGrid/Pagination/BaseGridPagination';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import ToolTip from './../BaseGrid/ToolTip';
import { useStore } from '../../../../utils/useStore';
import { pushDataLayer, getSortAnalytics } from '../Analytics/analytics';
import { getSessionInfo } from '../../../../utils/intouch/user/get';
import { loadIntouchHeaderAndFooter } from '../../../../utils/intouch/intouch/load';
import { enableIntouchLogin } from '../../../../utils/intouch/intouchUtils';

const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));

const getOptionsDefaultValues = () => {
  const currentOptions = {};

  const currentSecondLevelOptions = {
    colId: 'total',
    sort: 'desc',
  };

  if (
    hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) &&
    isFromRenewalDetailsPage()
  ) {
    currentOptions.defaultSortingColumnKey = getLocalStorageData(
      SORT_LOCAL_STORAGE_KEY
    ).colId;
    currentOptions.defaultSortingDirection = getLocalStorageData(
      SORT_LOCAL_STORAGE_KEY
    ).sort;
    currentSecondLevelOptions.colId = null;
    currentSecondLevelOptions.sort = null;
  }

  return { currentOptions, currentSecondLevelOptions };
};
function RenewalsGrid(props) {
  const { onAfterGridInit, onQueryChanged, handleQueryFlowLogic, resetGrid } =
    useExtendGridOperations(useRenewalGridState);
  const effects = useRenewalGridState((state) => state.effects);
  const category = useRenewalGridState((state) => state.analyticsCategory);
  const importFlyoutConfig = useRenewalGridState(
    (state) => state?.importFlyout
  );
  const showImportButton = useRenewalGridState(
    (state) => state.showImportButton
  );
  const gridApiRef = useRef();
  const firstAPICall = useRef(true);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const [isNewPurchaseEnabled, setIsNewPurchaseEnabled] = useState(false);

  const { setToolTipData, setCustomState, closeAndCleanToaster, toggleFilterButtonDisable } = effects;

  const componentProp = JSON.parse(props.componentProp);
  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;

  const hasSortChanged = useRef(false);

  const previousSortChanged = useRef(false);

  const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();

  const previousFilter = useRef(false);

  const { searchOptionsList, shopURL, icons, enableNewPurchaseAction } =
    componentProp;

  const defaultSearchDateRange = setDefaultSearchDateRange(30);

  const customPaginationRef = useRef();

  const renewalsRef = useRef();

  const searchCriteria = useRef({ field: '', value: '' });

  const toolTipData = useRenewalGridState(
    (state) => state.toolTipData,
    shallow
  );

  const { currentOptions, currentSecondLevelOptions } =
    getOptionsDefaultValues();

  const [options, setOptions] = useState(currentOptions);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [secondLevelOptions, setSecondLevelOptions] = useState(
    currentSecondLevelOptions
  );
  const [isGridInitialized, setIsGridInitialized] = useState(false);

  const redirectToShop = () => {
    if (!shopURL) return;
    window.location = shopURL;
  };

  const isPriceColumnClicked = useRef(false);

  useEffect(() => {
    const catchPriceColumnClickEvent = (e) => {
      e.stopPropagation();
      const innerText =
        e.target.innerText ||
        e.target.closest('.ag-header-cell-label')?.innerText;
      isPriceColumnClicked.current = innerText?.includes('Price');
    };
    window.addEventListener('click', catchPriceColumnClickEvent);

    const renewalsNode = renewalsRef.current;
    const parentRenewalsStyle =
      renewalsNode?.parentNode?.parentNode?.parentNode;
    const isTDSynnex =
      parentRenewalsStyle?.classList.contains('cmp-grid-td-synnex');
    const isTechdata =
      parentRenewalsStyle?.classList.contains('cmp-grid-techdata');
    let branding = isTDSynnex
      ? 'td-synnex'
      : isTechdata
      ? 'cmp-grid-techdata'
      : '';
    setCustomState({ key: 'branding', value: branding });

    return () =>
      window.removeEventListener('click', catchPriceColumnClickEvent);
  }, []);

  useEffect(() => {
    if (enableIntouchLogin()) {
      loadIntouchHeaderAndFooter();

      getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
    }
  }, []);

  useEffect(
    () => setCustomState({ key: 'aemConfig', value: componentProp }),
    []
  );

  useEffect(() => setCustomState({ key: 'dueDaysIcons', value: icons }), []);

  useEffect(() => {
    // In case of don't have access redirect to shop
    if (process.env.NODE_ENV === 'development') return;
    if (isAuthormodeAEM()) return; // Validation for Author ENV

    const currentUserData =
      isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : USER_DATA;

    // If user not logged in
    const access_message = document.querySelector('.renewals-errormessage');
    if (
      currentUserData &&
      !hasAccess({
        user: currentUserData,
        accessType: ACCESS_TYPES.CAN_ACCESS_RENEWALS,
      })
    ) {
      if (access_message) {
        setIsLoggedIn(false);
        access_message.style.display = 'block';
        document.querySelector('.subheader').style.display = 'none';
      }
    }
  }, [USER_DATA, userData, ACCESS_TYPES, hasAccess, isAuthormodeAEM]);

  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
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
      gridApiRef,
    };
    response = await handleFetchDataStrategy(renewalOperations);

    setCustomState({
      key: 'showImportButton',
      value: response?.data?.content?.importHeader?.isDisplay,
    });
    setCustomState({
      key: 'importFlyout',
      value: { options: response?.data?.content?.importHeader?.options },
    });

    if (response?.data?.content?.canDoNewPurchase) {
      setIsNewPurchaseEnabled(true);
    }

    const mappedResponse = mapServiceData(response);
    const { refinementGroups, ...rest } = mappedResponse?.data?.content;
    const pageSize = gridConfig.itemsPerPage;
    const paginationValue = setPaginationData(rest, pageSize);
    const responseContent = response?.data?.content;
    const pageNumber = responseContent?.pageNumber;

    if (responseContent?.pageCount === pageNumber)
      gridApi.paginationSetPageSize(responseContent?.items?.length);

    updateQueryString(pageNumber);

    setCustomState(
      { key: 'pagination', value: paginationValue },
      {
        key: PAGINATION_LOCAL_STORAGE_KEY,
        saveToLocal: true,
      }
    );
    if (refinementGroups) {
      setCustomState({ key: 'refinements', value: refinementGroups });
    }

    if (mappedResponse) {
        console.log(toggleFilterButtonDisable, "toggleFilterButtonDisable")
        toggleFilterButtonDisable(false);
    }

    return mappedResponse;
  };

  const onSortChanged = (evt) => {
    const currentSortState = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList
      .filter((o) => !!o.sort)
      .map(({ colId, sort }) => ({ colId, sort }));
    const renewalPlanItem = sortedModel.find(
      (x) => x.colId === 'renewedduration'
    );
    if (renewalPlanItem) {
      sortedModel.push({ ...renewalPlanItem, colId: 'support' });
    }
    hasSortChanged.current = sortedModel ? { sortData: sortedModel } : false;
    setLocalStorageData(SORT_LOCAL_STORAGE_KEY, hasSortChanged.current);
    const sortingEventFilter = evt?.columnApi
      ?.getColumnState()
      .filter((val) => val.sort);
    if (
      sortingEventFilter.length === 1 &&
      !compareSort(currentSortState, hasSortChanged.current)
    ) {
      pushDataLayer(getSortAnalytics(category, sortedModel));
    }
  };

  useEffect(() => {
    if (
      hasLocalStorageData(SORT_LOCAL_STORAGE_KEY) &&
      isFromRenewalDetailsPage()
    ) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
    if (!isFromRenewalDetailsPage()) {
      clearLocalStorageFilterData();
    }
  }, []);

  const showToasterFromLocalStorage = () => {
    if (hasLocalStorageData(TOASTER_LOCAL_STORAGE_KEY)) {
      const toasterData = getLocalStorageData(TOASTER_LOCAL_STORAGE_KEY);
      const transactionNumber = toasterData.Child?.props?.data;
      toasterData.Child = <TransactionNumber data={transactionNumber} />;

      setTimeout(
        () => setCustomState({ key: 'toaster', value: toasterData }),
        800
      );
    }

    if (!isFromRenewalDetailsPage()) {
      clearLocalStorageGridData();
    }
  };

  useEffect(() => {
    if (isGridInitialized && !!userData) {
      showToasterFromLocalStorage();
    }
  }, [isGridInitialized, userData]);

  const _onAfterGridInit = (config) => {
    const value = config.api;
    setCustomState({ key: 'gridApi', value });
    gridApiRef.current = config;
    onAfterGridInit(config);
    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
    const columnState = {
      state: isDefaultSort
        ? [
            {
              colId: dueDateKey,
              sort: dueDateDir,
            },
            { ...secondLevelOptions },
          ]
        : [...hasSortChanged.current.sortData],
      defaultState: { sort: null },
    };
    config.columnApi.applyColumnState({ ...columnState });

    setIsGridInitialized(true);
  };

  function tootltipVal(event) {
    switch (event.colDef.field) {
      case 'renewedduration':
        return formatRenewedDuration(
          event.data.source.type,
          event.data.renewedDuration,
          event.data.support
        );
      case 'resellername':
        return event.data.reseller.name + ' [' + event.data.reseller.id + ']';
      case 'vendor':
        return `${event.value.name}: ${event.data.programName}`;
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
  const processCustomClipboardAction = (params) =>
    copyToClipboardAction(params);

  const triggerRequestFlyout = (data) => {
    data['link'] = '';
    setCustomState({ key: 'requestFlyout', value: { data, show: true } });
  };

  useEffect(() => {
    const checkUrl = () => {
      if (
        enableNewPurchaseAction &&
        window.location.hash.includes('#open-new-purchase')
      ) {
        setCustomState({
          key: 'newPurchaseFlyout',
          value: {
            show: true,
          },
        });
      } else {
        setCustomState({
          key: 'newPurchaseFlyout',
          value: {
            show: false,
          },
        });
      }
    };

    // Initial check when component mounts
    checkUrl();

    // Function to handle URL changes
    const handleUrlChange = () => {
      checkUrl();
    };

    // Add event listeners for popstate and hashchange
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const newPurchaseButton = document.getElementById(
      'action-renewals-new-purchase'
    );

    if (newPurchaseButton) {
      newPurchaseButton.style.display = 'none';
      if (isNewPurchaseEnabled) {
        newPurchaseButton.style.display = 'flex';
      } else {
        newPurchaseButton.style.display = 'none';
      }
    }
  }, [isNewPurchaseEnabled]);

  return isLoggedIn ? (
    <section ref={renewalsRef} id="renewals-grid-component">
      <BaseGridHeader
        leftComponents={[
          <BaseGridPagination
            onQueryChanged={onQueryChanged}
            ref={customPaginationRef}
            store={useRenewalGridState}
          />,
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

          />,
          <RenewalImport
            aemData={componentProp}
            showImportButton={showImportButton}
          />,
        ]}
      />
      <BaseGrid
        columnList={componentProp.columnList}
        definitions={renewalsDefinitions(componentProp, triggerRequestFlyout)}
        config={gridConfig}
        options={options}
        sortingOrder={
          componentProp.disableDefaultSort
            ? ['asc', 'desc']
            : ['desc', 'asc', null]
        }
        onAfterGridInit={_onAfterGridInit}
        requestInterceptor={customRequestInterceptor}
        mapServiceData={mapServiceData}
        onSortChanged={onSortChanged}
        handlerIsRowMaster={() => true}
        icons={{ groupExpanded: '<i></i>', groupContracted: '<i></i>' }}
        DetailRenderers={RenewalDetailRenderers}
        onCellMouseOver={cellMouseOver}
        onCellMouseOut={cellMouseOut}
        omitCreatedQuery={true}
        contextMenuItems={contextMenuItems}
        processCustomClipboardAction={processCustomClipboardAction}
        defaultSearchDateRange={defaultSearchDateRange}
        noContextMenuItemsWhenColumnNull={true}
      />
      <ToolTip toolTipData={toolTipData} />
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
        message={{
          successSubmission: 'successSubmission',
          failedSubmission: 'failedSubmission',
        }}
      />
      <CopyFlyout
        store={useRenewalGridState}
        copyFlyout={gridConfig.copyFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        resetGrid={resetGrid}
      />
      <ShareFlyout
        store={useRenewalGridState}
        shareFlyoutContent={gridConfig.shareFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <NewPurchaseFlyout
        store={useRenewalGridState}
        copyFlyout={gridConfig.copyFlyout}
        newPurchaseFlyout={gridConfig.newPurchaseFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        userData={userData}
        componentProp={gridConfig}
        onQueryChanged={onQueryChanged}
      />
      <ImportFlyout
        store={useRenewalGridState}
        importFlyout={gridConfig.importFlyout}
      />
      <RevisionFlyout
        store={useRenewalGridState}
        revisionFlyoutContent={gridConfig.revisionFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <RequestFlyout
        store={useRenewalGridState}
        requestFlyoutContent={gridConfig.requestQuote}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
    </section>
  ) : null;
}

export default RenewalsGrid;



