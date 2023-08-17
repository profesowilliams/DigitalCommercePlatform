import React, { useEffect, useRef, useState } from 'react';
import {
  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
  ORDER_SEARCH_LOCAL_STORAGE_KEY,
  SORT_LOCAL_STORAGE_KEY,
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
} from './utils/orderTrackingUtils';
import {
  getHomeAnalyticsGoogle,
  getSortAnalyticsGoogle,
  pushDataLayerGoogle,
} from './utils/analyticsUtils';
import OrderDetailsRenderers from './Columns/OrderDetailsRenderers';
import { cellMouseOut, cellMouseOver } from './utils/tooltipUtils';
import MainGridHeader from './MainGrid/MainGridHeader';
import {
  addCurrencyToTotalColumn,
  doesCurrentSearchMatchResult,
  downloadFileBlob,
  getPaginationValue,
  isLocalDevelopment,
  setLocalStorageData,
  updateQueryString,
  removeLocalStorageData,
  mapServiceData,
  isFirstTimeSortParameters,
  getLocalStorageData,
  hasLocalStorageData,
} from './utils/gridUtils';
import MainGridFooter from './MainGrid/MainGridFooter';
import MainGridFlyouts from './MainGrid/MainGridFlyouts';

function OrdersTrackingGrid(props) {
  const [userData, setUserData] = useState(null);
  const previousFilter = useRef(false);
  const hasSortChanged = useRef(false);
  const previousSortChanged = useRef(false);
  const searchCriteria = useRef({ field: '', value: '' });
  const reportFilterValue = useRef({ value: '' });
  const customPaginationRef = useRef();
  const filtersRefs = useRef({
    createdFrom: null,
    createdTo: null,
    shippedDateFrom: null,
    shippedDateTo: null,
    invoiceDateFrom: null,
    invoiceDateTo: null,
    type: null,
    status: null,
    customFilterRef: null,
  });
  const {
    setToolTipData,
    setCustomState,
    closeAndCleanToaster,
    setFilterList,
    setCustomFiltersChecked,
    setDateType,
  } = useOrderTrackingStore((st) => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore
  );
  const hasRights = (entitlement) =>
    userData?.roleList?.some((role) => role.entitlement === entitlement);

  const hasAIORights = hasRights('AIO');
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasOrderModificationRights = hasRights('OrderModification');
  const [isLoading, setIsLoading] = useState(true);

  const componentProp = JSON.parse(props.componentProp);

  const formattedDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );
  const [dateRange, setDateRange] = useState(formattedDateRange);

  const {
    searchOptionsList = [],
    icons,
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
  };

  const predefined = getFilterFlyoutPredefined(filterLabels);

  const customized = getFilterFlyoutCustomized(
    dateOptionsList,
    filterListValues,
    predefined.length + 1
  );

  const toolTipData = useOrderTrackingStore((st) => st.toolTipData);
  const filterDefaultDateRange = useOrderTrackingStore(
    (st) => st.filterDefaultDateRange
  );

  const dueDateKey = componentProp.options.defaultSortingColumnKey;
  const dueDateDir = componentProp.options.defaultSortingDirection;
  let options = {
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

  const customRequestInterceptor = async (request) => {
    const gridApi = gridApiRef?.current?.api;
    const queryOperations = {
      hasSortChanged,
      // isFilterDataPopulated,
      // optionFieldsRef,
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
      filterDefaultDateRange,
    };
    request.url = addCurrentPageNumber(customPaginationRef, request);
    const ordersReportUrl = new URL(componentProp.ordersReportEndpoint);
    const ordersReportCountUrl = new URL(
      componentProp.ordersReportCountEndpoint
    );
    const ordersCountUrl = new URL(componentProp.ordersCountEndpoint);
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
          customPaginationRef
        )
      : await fetchData(queryOperations);

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

  const onDataLoad = (response) => {
    if (
      response.length >= 1 &&
      doesCurrentSearchMatchResult(response[0], searchCriteria)
    ) {
      removeLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY);
      window.location.href = `${componentProp.detailUrl}.html?id=${response[0].id}`;
    }
    setIsLoading(false);
  };

  async function openFilePdf(flyoutType, orderId, selectedId) {
    const url = componentProp.ordersDownloadDocumentsEndpoint || 'nourl';
    const singleDownloadUrl =
      url + `?Order=${orderId}&Type=${flyoutType}&id=${selectedId}`;
    const name = `${orderId}.pdf`;
    await requestFileBlobWithoutModal(singleDownloadUrl, name, {
      redirect: true,
    });
  }

  function onCloseToaster() {
    closeAndCleanToaster();
  }

  const hasAccess =
    hasCanViewOrdersRights || hasOrderTrackingRights || isLocalDevelopment;

  useEffect(() => {
    if (hasLocalStorageData(SORT_LOCAL_STORAGE_KEY)) {
      hasSortChanged.current = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
    }
    setFilterList([...predefined, ...customized]);
    setCustomFiltersChecked(customized);
    window.getSessionInfo &&
      window.getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
    setDateType(filterLabels.orderDateLabel);
    (userData?.activeCustomer || isLocalDevelopment) &&
      pushDataLayerGoogle(
        getHomeAnalyticsGoogle(hasAccess ? 'Rights' : 'No Rights')
      );
  }, []);

  return (
    <>
      {(userData?.activeCustomer || isLocalDevelopment) && (
        <>
          {hasAccess ? (
            <div className="cmp-order-tracking-grid">
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
                DetailRenderers={(props) => (
                  <OrderDetailsRenderers
                    {...props}
                    config={gridConfig}
                    openFilePdf={(flyoutType, orderId, selectedId) =>
                      openFilePdf(flyoutType, orderId, selectedId)
                    }
                    hasAIORights={hasAIORights}
                    hasOrderModificationRights={hasOrderModificationRights}
                  />
                )}
                onCellMouseOver={(e) => cellMouseOver(e, setToolTipData)}
                onCellMouseOut={() => cellMouseOut(setToolTipData)}
              />
              <MainGridFooter
                gridConfig={gridConfig}
                downloadFileBlob={downloadFileBlob}
                openFilePdf={openFilePdf}
                analyticsCategories={analyticsCategories}
                hasAIORights={hasAIORights}
                onQueryChanged={onQueryChanged}
                filtersRefs={filtersRefs}
                filterLabels={filterLabels}
                onCloseToaster={onCloseToaster}
                toolTipData={toolTipData}
                customPaginationRef={customPaginationRef}
                isLoading={isLoading}
                paginationLabels={paginationLabels}
              />
            </div>
          ) : (
            <AccessPermissionsNeeded noAccessProps={noAccessProps} />
          )}
        </>
      )}
      <MainGridFlyouts
        downloadFileBlob={downloadFileBlob}
        filterLabels={filterLabels}
        filtersRefs={filtersRefs}
        gridConfig={gridConfig}
        hasAIORights={hasAIORights}
        openFilePdf={openFilePdf}
        analyticsCategories={analyticsCategories}
        onQueryChanged={onQueryChanged}
      />
    </>
  );
}
export default OrdersTrackingGrid;
