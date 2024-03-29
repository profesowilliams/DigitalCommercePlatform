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
  getFilterFlyoutCustomized,
  getInitialFiltersDataFromLS,
} from './utils/orderTrackingUtils';
import {
  getHomeAnalyticsGoogle,
  getMainDashboardAnalyticsGoogle,
  getSortAnalyticsGoogle,
  pushDataLayerGoogle,
  getPageReloadAnalyticsGoogle,
  pushFailedDownloadGoogleAnalytics,
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

  const {
    setUserData,
    setCustomState,
    closeAndCleanToaster,
    setFilterList,
    setCustomFiltersChecked,
    setFeatureFlags,
  } = useOrderTrackingStore((st) => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore,
    { resetCallback, shouldGoToFirstPage, isOnSearchAction }
  );
  const userData = useOrderTrackingStore((st) => st.userData);
  const { isGTMReady } = useGTMStatus();
  const hasRights = (entitlement) =>
    userData?.roleList?.some((role) => role.entitlement === entitlement);

  const [isLoading, setIsLoading] = useState(true);
  const [responseError, setResponseError] = useState(null);
  const [sendAnalyticsDataHome, setSendAnalyticsDataHome] = useState(true);
  const [newItem, setNewItem] = useState(null);
  const componentProp = JSON.parse(props.componentProp);

  const formattedDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );
  const [dateRange, setDateRange] = useState(formattedDateRange);

  const {
    searchOptionsList = [],
    reportPillLabel,
    filterListValues,
    dateOptionsList,
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
      defaultSearchDateRange: dateRange,
      filtersRefs,
      isOnSearchAction,
    };
    request.url = addCurrentPageNumber(customPaginationRef, request);
    const ordersReportUrl = new URL(componentProp.ordersReportEndpoint);
    const ordersReportCountUrl = new URL(
      componentProp.ordersReportCountEndpoint
    );

    const ordersCountUrl = new URL(
      `${componentProp.uiCommerceServiceDomain}/v3/orders/count`
    );
    const ordersCountResponse = await fetchOrdersCount(
      reportFilterValue.current?.value
        ? ordersReportCountUrl.href
        : ordersCountUrl.href,
      dateRange,
      filtersRefs,
      reportFilterValue.current?.value,
      searchCriteria
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

    if (ordersCountResponse.error?.isError) {
      setResponseError(true);
    } else {
      setResponseError(false);
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
    }
  };

  const onSortChanged = (evt) => {
    const currentSortState = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    const sortModelList = evt.columnApi.getColumnState();
    const sortedModel = sortModelList
      .filter((o) => !!o.sort)
      .map(({ colId, sort }) => ({ colId, sort }));
    hasSortChanged.current = sortedModel ? { sortData: sortedModel } : false;
    setLocalStorageData(SORT_LOCAL_STORAGE_KEY, hasSortChanged.current);
    const sortingEventFilter = evt?.columnApi
      ?.getColumnState()
      .filter((val) => val.sort);
    if (
      sortingEventFilter.length === 1 &&
      !compareSort(currentSortState, hasSortChanged.current)
    ) {
      pushDataLayerGoogle(
        getSortAnalyticsGoogle(analyticsCategories.sort, sortedModel)
      );
    }
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
    if (!(redirectedFrom === 'detailsPage' || pageAccessedByReload)) {
      resetLocalStorage(searchParamsKeys);
    }
    filtersRefs.current = getInitialFiltersDataFromLS();
    redirectedFrom && deleteSearchParam('redirectedFrom');
    const refinements = await fetchFiltersRefinements();
    setFeatureFlags(refinements?.featureFlags);
    const predefined = getFilterFlyoutPredefined(filterLabels, refinements);
    const customized = getFilterFlyoutCustomized(
      dateOptionsList,
      filterListValues,
      predefined.length + 1
    );
    setFilterList([...predefined, ...customized]);
    setCustomFiltersChecked(customized);
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
            country: data[1]?.country == 'UK' ? 'GB' : data[1]?.country,
            internalTraffic: data[1]?.isInternalUser ? 'True' : 'False',
            pageName: 'Main Dashboard',
            number: '',
            userID: data[1]?.id,
            customerID: data[1]?.customers[0],
            industryKey: data[1]?.industryKey,
          })
        );
        pushDataLayerGoogle(getMainDashboardAnalyticsGoogle());

        if (sendAnalyticsDataHome) {
          if (hasAccess) {
            pushDataLayerGoogle(getHomeAnalyticsGoogle('Rights'));
            setSendAnalyticsDataHome(false);
          } else {
            pushDataLayerGoogle(getHomeAnalyticsGoogle('No Rights'));
            setSendAnalyticsDataHome(false);
          }
        }
      }
    });
  }, [isGTMReady]);

  const hasAIORights = hasRights('AIO');
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasOrderModificationRights = hasRights('OrderModification');
  const hasAccess = hasCanViewOrdersRights || hasOrderTrackingRights;
  const searchOptions = [
    ...getPredefinedSearchOptionsList(searchLabels),
    ...searchOptionsList,
  ];
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

  const authorizedContent = () => {
    return hasAccess ? (
      <div className="cmp-order-tracking-grid">
        <Criteria config={gridConfig} />
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
            hasAIORights
          )}
          config={gridConfig}
          options={options}
          gridConfig={gridConfig}
          defaultSearchDateRange={dateRange}
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
              hasAIORights={hasAIORights}
              hasOrderModificationRights={hasOrderModificationRights}
              rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
              newItem={newItem}
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
        }}
        defaultDateRange={componentProp?.defaultSearchDateRange}
        settings={settingsResponse}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={handleAddNewItem}
      />
    </>
  );
}
export default OrdersTrackingGrid;
