import React, { useEffect, useRef, useState } from 'react';
import {
  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  REPORTS_LOCAL_STORAGE_KEY,
} from '../../../../utils/constants';
import { setDefaultSearchDateRange } from '../../../../utils/utils';
import BaseGrid from '../BaseGrid/BaseGrid';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import { useOrderTrackingStore } from './store/OrderTrackingStore';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';
import { requestFileBlobWithoutModal } from '../../../../utils/utils';
import { getUrlParamsCaseInsensitive } from '../../../../utils';
import AccessPermissionsNeeded from './../AccessPermissionsNeeded/AccessPermissionsNeeded';
import {
  addCurrentPageNumber,
  compareSort,
  fetchData,
  fetchOrdersCount,
  fetchReport,
  getFilterFlyoutPredefined,
  getInitialFiltersDataFromLS,
  endpoints,
  filtersDateGroup,
} from './utils/orderTrackingUtils';
import {
  getHomeAnalyticsGoogle,
  getMainDashboardAnalyticsGoogle,
  getSortAnalyticsGoogle,
  pushDataLayerGoogle,
  getPageReloadAnalyticsGoogle,
  pushFailedDownloadGoogleAnalytics,
  getSearchNRFAnalyticsGoogle,
  getAdvancedSearchNRFAnalyticsGoogle,
  getReportsNRFAnalyticsGoogle,
  fixCountryCode,
} from './utils/analyticsUtils';
import OrderDetailsRenderers from './Columns/OrderDetailsRenderers';
import MainGridHeader from './MainGrid/MainGridHeader';
import {
  addCurrencyToTotalColumn,
  getPaginationValue,
  setLocalStorageData,
  updateQueryString,
  mapServiceData,
  isFirstTimeSortParameters,
  getLocalStorageData,
  hasLocalStorageData,
  resetLocalStorage,
  pageAccessedByReload,
  buildQueryString,
} from './utils/gridUtils';
import MainGridFooter from './MainGrid/MainGridFooter';
import MainGridFlyouts from './MainGrid/MainGridFlyouts';
import { getSessionInfo } from '../../../../utils/user/get';
import { usGet } from '../../../../utils/api';
import useGet from '../../hooks/useGet';

import { getUrlParams, deleteSearchParam } from '../../../../utils';
import Criteria from './Criteria/Criteria';
import { useGTMStatus } from '../../hooks/useGTMStatus';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getPredefinedSearchOptionsList } from './utils/orderTrackingUtils';

const searchParamsKeys = [
  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  REPORTS_LOCAL_STORAGE_KEY,
];

const translationDictionaries = [
  "OrderTracking.FreetextSearchFields",
  "OrderTracking.MainGrid",
  "OrderTracking.MainGrid.Items",
  "OrderTracking.MainGrid.OrderLineDropdown",
  "OrderTracking.MainGrid.Filters",
  "OrderTracking.MainGrid.Reports",
  "OrderTracking.MainGrid.Search",
  "OrderTracking.MainGrid.ExportFlyout",
  "OrderTracking.MainGrid.OrderModify",
  "OrderTracking.MainGrid.SettingsFlyout",
  "OrderTracking.MainGrid.InvoicesFlyout",
  "OrderTracking.MainGrid.DnoteFlyout",
  "OrderTracking.MainGrid.NoAccessScreen",
  "OrderTracking.MainGrid.PagginationLabels",
  "OrderTracking.MainGrid.SearchNoResult",
  "OrderTracking.MainGrid.ProductReplacmentFlyout",
  "OrderTracking.MainGrid.OrderStatuses"
];

function OrdersTrackingGrid(props) {
  const { redirectedFrom = '' } = getUrlParams();
  const previousFilter = useRef(false);
  const hasSortChanged = useRef(false);
  const previousSortChanged = useRef(false);
  const searchCriteria = useRef({ field: '', value: '' });
  const reportFilterValue = useRef({ value: '' });
  const customPaginationRef = useRef();
  const filtersRefs = useRef({});
  const resetCallback = useRef(null);
  const shouldGoToFirstPage = useRef(false);
  const isOnSearchAction = useRef(false);
  const dNoteFailedCounter = useRef(1);
  const invoiceFailedCounter = useRef(1);
  const rowsToGrayOutTDNameRef = useRef([]);
  const alternativeSearchFlagRef = useRef(null);

  const {
    setUserData,
    setCustomState,
    closeAndCleanToaster,
    setFilterList,
    setFeatureFlags,
    setTranslations,
    hasRights,
    setMainGridRowsTotalCounter,
    updateOrderFilterCounter,
    setClearFilters,
  } = useOrderTrackingStore((st) => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore,
    { resetCallback, shouldGoToFirstPage, isOnSearchAction }
  );
  const userData = useOrderTrackingStore((st) => st.userData);
  const alternativeSearchFlag = useOrderTrackingStore(
    (state) => state.featureFlags.alternativeSearch
  );
  const { isGTMReady } = useGTMStatus();

  const [isLoading, setIsLoading] = useState(true);
  const [reloadAddedToGTM, setReloadAddedToGTM] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [sendAnalyticsDataHome, setSendAnalyticsDataHome] = useState(true);
  const [newItem, setNewItem] = useState(null);
  const [searchParameters, setSearchParameters] = useState({
    field: '',
    value: '',
  });
  const componentProp = JSON.parse(props.componentProp);

  const formattedDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );
  const [dateRange, setDateRange] = useState(formattedDateRange);

  const {
    searchOptionsList = [],
    reportPillLabel,
    filterLabels,
    noAccessProps,
    analyticsCategories,
    paginationLabels,
    searchLabels,
  } = componentProp;
  const gridApiRef = useRef();
  const firstAPICall = useRef(true);
  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
  };

  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;
  const options = {
    defaultSortingColumnKey: 'created',
    defaultSortingDirection: 'desc',
  };
  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  const _onAfterGridInit = (config) => {
    onAfterGridInit(config);
    gridApiRef.current = config;
    const isDefaultSort = isFirstTimeSortParameters(hasSortChanged.current);
    const columnState = {
      state: isDefaultSort
        ? [
            {
              colId: dueDateKey,
              sort: dueDateDir,
            },
          ]
        : [...hasSortChanged.current.sortData],
      defaultState: { sort: null },
    };
    config.columnApi.applyColumnState({ ...columnState });
  };
  const params = getUrlParamsCaseInsensitive();

  const sendGTMDataOnError = () => {
    if (reportFilterValue?.current?.value) {
      pushDataLayerGoogle(
        getReportsNRFAnalyticsGoogle(reportFilterValue.current.value)
      );
    }
    if (searchCriteria?.current?.field) {
      pushDataLayerGoogle(
        getSearchNRFAnalyticsGoogle(searchCriteria?.current?.field)
      );
    }
    const filtersStatusAndType =
      (filtersRefs?.current?.type ?? '') + (filtersRefs?.current?.status ?? '');
    const dateFilters = Object.entries(filtersRefs?.current).filter(
      (entry) => filtersDateGroup.includes(entry[0]) && Boolean(entry[1])
    );
    if (filtersStatusAndType !== '' || dateFilters.length > 0) {
      pushDataLayerGoogle(getAdvancedSearchNRFAnalyticsGoogle());
    }
  };

  const customRequestInterceptor = async (request) => {
    const gridApi = gridApiRef?.current?.api;
    const queryOperations = {
      hasSortChanged,
      customPaginationRef,
      componentProp,
      searchCriteria,
      previousFilter,
      request,
      previousSortChanged,
      firstAPICall,
      gridApiRef,
      filtersRefs,
      isOnSearchAction,
      alternativeSearchFlagRef,
    };
    setSearchParameters(searchCriteria?.current);
    request.url = addCurrentPageNumber(customPaginationRef, request);
    const ordersReportUrl = new URL(
      componentProp.uiCommerceServiceDomain + endpoints.ordersReport
    );
    const ordersReportCountUrl = new URL(
      componentProp.uiCommerceServiceDomain + endpoints.ordersReportCount
    );

    const ordersCountUrl = new URL(
      `${componentProp.uiCommerceServiceDomain}/v3/orders/count`
    );
    const ordersCountResponse = await fetchOrdersCount(
      reportFilterValue.current?.value
        ? ordersReportCountUrl.href
        : ordersCountUrl.href,
      filtersRefs,
      reportFilterValue.current?.value,
      searchCriteria,
      alternativeSearchFlagRef
    );
    const response = reportFilterValue.current?.value
      ? await fetchReport(
          ordersReportUrl,
          reportFilterValue.current.value,
          customPaginationRef,
          hasSortChanged,
          isOnSearchAction.current
        )
      : await fetchData(queryOperations);
      const isFirstPage = customPaginationRef?.current?.pageNumber === 1;
      setMainGridRowsTotalCounter(
        isFirstPage ? response?.data?.content?.items?.length : null
      );
    if (ordersCountResponse.error?.isError) {
      setResponseError(true);
      sendGTMDataOnError();
    } else {
      setResponseError(false);
      if (
        response?.status !== 200 ||
        response?.data?.content?.items?.length === 0
      ) {
        sendGTMDataOnError();
      }
    }
    const mappedResponse = mapServiceData(response);
    const paginationValue = getPaginationValue(
      mappedResponse,
      ordersCountResponse,
      gridConfig
    );

    const responseContent = response?.data?.content;
    const pageNumber = responseContent?.pageNumber;
    if (responseContent?.pageCount === pageNumber)
      gridApi.paginationSetPageSize(responseContent?.items?.length);
    updateQueryString(pageNumber);
    setCustomState(
      { key: 'pagination', value: paginationValue },
      {
        key: ORDER_PAGINATION_LOCAL_STORAGE_KEY,
        saveToLocal: true,
      }
    );
    return mappedResponse;
  };

  const onSortChanged = (evt) => {
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList
      .filter((o) => !!o.sort)
      .map(({ colId, sort }) => ({ colId, sort }));
    if (
      hasSortChanged.current?.sortData &&
      !compareSort(hasSortChanged.current.sortData, sortedModel)
    ) {
      const sortData = sortedModel
        .map((item) => `${item.colId}: ${item.sort}`)
        .join();
      if (sortData !== '') {
        pushDataLayerGoogle(getSortAnalyticsGoogle(sortData, 'Click'));
      }
    }
    if (sortedModel) {
      hasSortChanged.current = { sortData: sortedModel };
    }
    setLocalStorageData(SORT_LOCAL_STORAGE_KEY, hasSortChanged.current);
  };

  const onDataLoad = () => {
    setIsLoading(false);
  };

  const downloadFileBlob = async (flyoutType, orderId, selectedId) => {
    let response = null;
    try {
      const url = `${componentProp.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
      const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
      const downloadOrderInvoicesUrl =
        url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;
      response = await requestFileBlobWithoutModal(
        downloadOrderInvoicesUrl,
        null,
        {
          redirect: false,
        }
      );
      if (response?.status === 204) {
        pushFailedDownloadGoogleAnalytics(
          flyoutType,
          true,
          dNoteFailedCounter.current,
          invoiceFailedCounter.current
        );
        if (flyoutType === 'DNote') {
          dNoteFailedCounter.current++;
        } else if (flyoutType === 'Invoice') {
          invoiceFailedCounter.current++;
        }
      }
    } catch (error) {
      pushFailedDownloadGoogleAnalytics(
        flyoutType,
        true,
        dNoteFailedCounter.current,
        invoiceFailedCounter.current
      );
      if (flyoutType === 'DNote') {
        dNoteFailedCounter.current++;
      } else if (flyoutType === 'Invoice') {
        invoiceFailedCounter.current++;
      }
      console.error('Error', error);
    }
  };
  const openFilePdf = async (flyoutType, orderId, selectedId) => {
    const url = `${componentProp.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
    const singleDownloadUrl =
      url + `?Order=${orderId}&Type=${flyoutType}&id=${selectedId}`;
    let response = null;
    try {
      response = await requestFileBlobWithoutModal(singleDownloadUrl, null, {
        redirect: true,
      });
      if (response?.status === 204) {
        pushFailedDownloadGoogleAnalytics(
          flyoutType,
          true,
          dNoteFailedCounter.current,
          invoiceFailedCounter.current
        );
        if (flyoutType === 'DNote') {
          dNoteFailedCounter.current++;
        } else if (flyoutType === 'Invoice') {
          invoiceFailedCounter.current++;
        }
      }
    } catch (error) {
      pushFailedDownloadGoogleAnalytics(
        flyoutType,
        true,
        dNoteFailedCounter.current,
        invoiceFailedCounter.current
      );
      if (flyoutType === 'DNote') {
        dNoteFailedCounter.current++;
      } else if (flyoutType === 'Invoice') {
        invoiceFailedCounter.current++;
      }
      console.error('Error', error);
    }
  };

  const onCloseToaster = () => {
    closeAndCleanToaster();
  };

  const fetchFiltersRefinements = async () => {
    const results = await usGet(
      `${componentProp.uiCommerceServiceDomain}/v3/refinements`
    );
    return results.data.content;
  };

  const fetchUITranslations = async () => {
    const results = await usGet(
      // TODO: cacheInSec - cache value should be configurable? or hardcoded 3600?
      `${componentProp.uiLocalizeServiceDomain}/v1` + buildQueryString(translationDictionaries) + `&cacheInSec=300` 
    );
    return results.data;
  };

  const [settingsResponse] = useGet(
    `${gridConfig.uiProactiveServiceDomain}/v1`,
    'settings'
  );

  const triggerSettingsFlyout = (settings) => {
    setCustomState({
      key: 'settingsFlyout',
      value: { show: true, data: settings },
    });
  };

  useEffect(async () => {
    document.title = getDictionaryValueOrKey(gridConfig?.pageTitle);
    if (!(redirectedFrom === 'detailsPage' || pageAccessedByReload)) {
      resetLocalStorage(searchParamsKeys);
      setClearFilters();
    }
    filtersRefs.current = getInitialFiltersDataFromLS();
    redirectedFrom && deleteSearchParam('redirectedFrom');
    const refinements = await fetchFiltersRefinements();
    setFeatureFlags(refinements?.featureFlags);
    const predefined = getFilterFlyoutPredefined(filterLabels, refinements);
    setFilterList([...predefined]);
    updateOrderFilterCounter();
    const uiTranslations = await fetchUITranslations();
    setTranslations(uiTranslations);
  }, []);

  useEffect(() => {
    if (settingsResponse && params.has('notifications')) {
      triggerSettingsFlyout(settingsResponse);
    }
  }, [settingsResponse]);

  useEffect(() => {
    if (hasLocalStorageData(SORT_LOCAL_STORAGE_KEY)) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
    getSessionInfo().then((data) => {
      setUserData(data[1]);
      if (isGTMReady) {
        pushDataLayerGoogle(
          getPageReloadAnalyticsGoogle({
            country: fixCountryCode(data[1]?.country),
            internalTraffic: data[1]?.isInternalUser ? 'True' : 'False',
            pageName: 'Main Dashboard',
            number: '',
            userID: data[1]?.id,
            customerID: data[1]?.customers[0],
            industryKey: data[1]?.industryKey,
          })
        );
        setReloadAddedToGTM(true);
        pushDataLayerGoogle(getMainDashboardAnalyticsGoogle());
      }
    });
  }, [isGTMReady]);

  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasAccess = hasCanViewOrdersRights || hasOrderTrackingRights;
  const searchOptions = [
    ...getPredefinedSearchOptionsList(searchLabels),
    ...searchOptionsList,
  ];

  useEffect(() => {
    if (sendAnalyticsDataHome && reloadAddedToGTM) {
      if (hasAccess) {
        pushDataLayerGoogle(getHomeAnalyticsGoogle('Rights'));
        setSendAnalyticsDataHome(false);
      } else {
        pushDataLayerGoogle(getHomeAnalyticsGoogle('No Rights'));
        setSendAnalyticsDataHome(false);
      }
    }
  }, [userData, isGTMReady, reloadAddedToGTM]);

  useEffect(() => {
    if (!userData) {
      return;
    }
    if (
      params.get('report') &&
      params.get('report').toLowerCase() === 'EOL'.toLowerCase()
    ) {
      reportFilterValue.current.value = 'EOLOrders';
      setLocalStorageData(REPORTS_LOCAL_STORAGE_KEY, {
        key: 'EOLOrders',
        label: getDictionaryValueOrKey(
          gridConfig?.reportLabels?.eolReportLabel
        ),
      });
      setCustomState({
        key: 'showCriteria',
        value: false,
      });
      onQueryChanged();
    }
    searchOptions.forEach((el) => {
      if (params.has(el.param)) {
        searchCriteria.current.field = el.searchKey;
        searchCriteria.current.value = params.get(el.param);
        setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
          field: el.searchKey,
          value: params.get(el.param),
        });
        onQueryChanged({ onSearchAction: true });
      }
    });
  }, [userData]);

  useEffect(() => {
    alternativeSearchFlagRef.current = alternativeSearchFlag;
  }, [alternativeSearchFlag]);

  const authorizedContent = () => {
    return hasAccess ? (
      <div className="cmp-order-tracking-grid">
        <Criteria
          config={gridConfig}
          searchCriteria={searchParameters}
          reportValue={reportFilterValue.current.value}
        />
        <MainGridHeader
          onQueryChanged={onQueryChanged}
          searchLabels={searchLabels}
          searchOptionsList={searchOptionsList}
          reportPillLabel={reportPillLabel}
          setDateRange={setDateRange}
          analyticsCategories={analyticsCategories}
          paginationLabels={paginationLabels}
          customPaginationRef={customPaginationRef}
          isLoading={isLoading}
          searchCriteria={searchCriteria}
          gridConfig={gridConfig}
          reportFilterValue={reportFilterValue}
          filtersRefs={filtersRefs}
          settings={settingsResponse}
        />
        <BaseGrid
          columnList={addCurrencyToTotalColumn(
            componentProp.columnList,
            userData
          )}
          definitions={ordersTrackingDefinition(
            componentProp,
            openFilePdf,
            userData?.isInternalUser
          )}
          config={gridConfig}
          options={options}
          gridConfig={gridConfig}
          omitCreatedQuery={true}
          requestInterceptor={customRequestInterceptor}
          mapServiceData={mapServiceData}
          onSortChanged={onSortChanged}
          onAfterGridInit={_onAfterGridInit}
          onDataLoad={onDataLoad}
          responseError={responseError}
          DetailRenderers={(props) => (
            <OrderDetailsRenderers
              {...props}
              config={gridConfig}
              openFilePdf={(flyoutType, orderId, selectedId) =>
                openFilePdf(flyoutType, orderId, selectedId)
              }
              rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
              newItem={newItem}
              onQueryChanged={onQueryChanged}
            />
          )}
        />
        <MainGridFooter
          analyticsCategories={analyticsCategories}
          onQueryChanged={onQueryChanged}
          onCloseToaster={onCloseToaster}
          customPaginationRef={customPaginationRef}
          isLoading={isLoading}
          paginationLabels={paginationLabels}
        />
      </div>
    ) : (
      <AccessPermissionsNeeded noAccessProps={noAccessProps} />
    );
  };

  return (
    <>
      {userData?.activeCustomer && authorizedContent()}
      <MainGridFlyouts
        downloadFileBlob={downloadFileBlob}
        filterLabels={filterLabels}
        gridConfig={gridConfig}
        openFilePdf={openFilePdf}
        analyticsCategories={analyticsCategories}
        onQueryChanged={onQueryChanged}
        userData={userData}
        searchParams={{
          reports: reportFilterValue,
          sort: hasSortChanged,
          search: searchCriteria,
          filters: filtersRefs,
          dateRange: dateRange,
        }}
        settings={settingsResponse}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={handleAddNewItem}
      />
    </>
  );
}
export default OrdersTrackingGrid;
