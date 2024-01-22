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
} from './utils/analyticsUtils';
import OrderDetailsRenderers from './Columns/OrderDetailsRenderers';
import { cellMouseOut, cellMouseOver } from './utils/tooltipUtils';
import MainGridHeader from './MainGrid/MainGridHeader';
import {
  addCurrencyToTotalColumn,
  getPaginationValue,
  isLocalDevelopment,
  setLocalStorageData,
  updateQueryString,
  removeLocalStorageData,
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

const searchParamsKeys = [
  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
  ORDER_FILTER_LOCAL_STORAGE_KEY,
  REPORTS_LOCAL_STORAGE_KEY,
];

function OrdersTrackingGrid(props) {
  const { redirectedFrom = '' } = getUrlParams();
  const [userData, setUserData] = useState(null);
  const [detailsApiResponse, setDetailsApiResponse] = useState(null);
  const areSearchParamsValid = useRef(false);
  const previousFilter = useRef(false);
  const hasSortChanged = useRef(false);
  const previousSortChanged = useRef(false);
  const searchCriteria = useRef({ field: '', value: '' });
  const reportFilterValue = useRef({ value: '' });
  const customPaginationRef = useRef();
  const filtersRefs = useRef({});
  const gridRef = useRef();
  const rowsToGrayOutTDNameRef = useRef([]);
  const resetCallback = useRef(null);
  const shouldGoToFirstPage = useRef(false);
  const isOnSearchAction = useRef(false);
  const {
    setToolTipData,
    setCustomState,
    closeAndCleanToaster,
    setFilterList,
    setCustomFiltersChecked,
  } = useOrderTrackingStore((st) => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore,
    { resetCallback, shouldGoToFirstPage, isOnSearchAction }
  );
  const hasRights = (entitlement) =>
    userData?.roleList?.some((role) => role.entitlement === entitlement);

  const hasAIORights = hasRights('AIO');
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasOrderModificationRights = hasRights('OrderModification');
  const [isLoading, setIsLoading] = useState(true);
  const [responseError, setResponseError] = useState(null);
  const [sendAnalyticsDataHome, setSendAnalyticsDataHome] = useState(true);
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
    criteriaLabels,
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

  const toolTipData = useOrderTrackingStore((st) => st.toolTipData);

  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;
  const options = {
    defaultSortingColumnKey: 'created',
    defaultSortingDirection: 'desc',
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
  const params = new URLSearchParams(window.location.search);

  const areUrlSearchParamsPresent =
    params.has('customerId') &&
    params.has('salesOrg') &&
    params.get('report') === 'EOL';

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
    } else if (
      areUrlSearchParamsPresent &&
      areSearchParamsValid.current === false
    ) {
      return;
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
    try {
      const url = `${componentProp.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
      const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
      const downloadOrderInvoicesUrl =
        url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;
      await requestFileBlobWithoutModal(downloadOrderInvoicesUrl, null, {
        redirect: false,
      });
    } catch (error) {
      console.error('Error', error);
    }
  };
  const openFilePdf = async (flyoutType, orderId, selectedId) => {
    const url = `${componentProp.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
    const singleDownloadUrl =
      url + `?Order=${orderId}&Type=${flyoutType}&id=${selectedId}`;
    await requestFileBlobWithoutModal(singleDownloadUrl, null, {
      redirect: true,
    });
  };

  const onCloseToaster = () => {
    closeAndCleanToaster();
  };

  const hasAccess =
    hasCanViewOrdersRights || hasOrderTrackingRights || isLocalDevelopment;

  const fetchFiltersRefinements = async () => {
    const results = await usGet(
      `${componentProp.uiCommerceServiceDomain}/v3/refinements`
    );
    return results.data.content;
  };

  const resetReports = () => {
    removeLocalStorageData(REPORTS_LOCAL_STORAGE_KEY);
    reportFilterValue.current = {};
  };

  const [settingsResponse, loading, error] = useGet(
    `${gridConfig.uiProactiveServiceDomain}/v1`
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
      window?.td &&
        pushDataLayerGoogle(
          getPageReloadAnalyticsGoogle({
            country: data[1]?.country,
            internalTraffic: data[1]?.isInternal,
            pageName: 'Main Dashboard',
            number: '',
            userID: window?.td?.userId ?? '',
            customerID: window?.td?.customerId ?? '',
            industryKey: window?.td?.industryKey ?? '',
          })
        );
    });
    pushDataLayerGoogle(getMainDashboardAnalyticsGoogle());
  }, [window?.td]);

  const customerNumber = userData?.activeCustomer?.customerNumber;
  const salesOrg = userData?.activeCustomer?.salesOrg;

  useEffect(() => {
    if (!userData || !areUrlSearchParamsPresent) {
      return;
    } else if (
      params.get('customerId') === customerNumber &&
      params.get('salesOrg') === salesOrg
    ) {
      if (params.get('report') === 'EOL') {
        reportFilterValue.current.value = 'EOLReport';
        onQueryChanged();
      }
      areSearchParamsValid.current = true;
    } else {
      areSearchParamsValid.current = false;
      setResponseError(true);
    }
  }, [userData]);

  return (
    <>
      {(userData?.activeCustomer || isLocalDevelopment) && (
        <>
          {hasAccess ? (
            <div className="cmp-order-tracking-grid">
              {(() => {
                if (sendAnalyticsDataHome) {
                  pushDataLayerGoogle(getHomeAnalyticsGoogle('Rights'));
                  setSendAnalyticsDataHome(false);
                }
              })()}
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
                  <>
                    <OrderDetailsRenderers
                      {...props}
                      config={gridConfig}
                      openFilePdf={(flyoutType, orderId, selectedId) =>
                        openFilePdf(flyoutType, orderId, selectedId)
                      }
                      hasAIORights={hasAIORights}
                      hasOrderModificationRights={hasOrderModificationRights}
                      setDetailsApiResponse={setDetailsApiResponse}
                      gridRef={gridRef}
                      rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
                    />
                  </>
                )}
                onCellMouseOver={(e) => cellMouseOver(e, setToolTipData)}
                onCellMouseOut={() => cellMouseOut(setToolTipData)}
              />
              <MainGridFooter
                analyticsCategories={analyticsCategories}
                onQueryChanged={onQueryChanged}
                onCloseToaster={onCloseToaster}
                toolTipData={toolTipData}
                customPaginationRef={customPaginationRef}
                isLoading={isLoading}
                paginationLabels={paginationLabels}
              />
            </div>
          ) : (
            <>
              {(() => {
                if (sendAnalyticsDataHome) {
                  pushDataLayerGoogle(getHomeAnalyticsGoogle('No Rights'));
                  setSendAnalyticsDataHome(false);
                }
              })()}
              <AccessPermissionsNeeded noAccessProps={noAccessProps} />
            </>
          )}
        </>
      )}
      <MainGridFlyouts
        downloadFileBlob={downloadFileBlob}
        filterLabels={filterLabels}
        gridConfig={gridConfig}
        hasAIORights={hasAIORights}
        openFilePdf={openFilePdf}
        analyticsCategories={analyticsCategories}
        onQueryChanged={onQueryChanged}
        apiResponse={detailsApiResponse}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        userData={userData}
        searchParams={{
          reports: reportFilterValue,
          sort: hasSortChanged,
          search: searchCriteria,
          filters: filtersRefs,
        }}
        resetReports={resetReports}
        defaultDateRange={componentProp?.defaultSearchDateRange}
        settings={settingsResponse}
      />
    </>
  );
}
export default OrdersTrackingGrid;
