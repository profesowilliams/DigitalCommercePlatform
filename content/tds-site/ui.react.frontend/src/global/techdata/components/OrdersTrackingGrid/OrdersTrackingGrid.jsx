import React, { useEffect, useRef, useState } from 'react';
import BaseGrid from '../BaseGrid/BaseGrid';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import { useOrderTrackingStore } from './../OrdersTrackingCommon/Store/OrderTrackingStore';
import { ordersTrackingDefinition } from './Utils/ordersTrackingDefinitions';
import { getUrlParamsCaseInsensitive } from '../../../../utils/index';
import AccessPermissionsNeeded from './../AccessPermissionsNeeded/AccessPermissionsNeeded';
import { fetchData, fetchOrdersCount, fetchReport, filtersDateGroup, } from './Utils/orderTrackingUtils';
import {
  getHomeAnalyticsGoogle,
  getMainDashboardAnalyticsGoogle,
  getSortAnalyticsGoogle,
  pushDataLayerGoogle,
  getPageReloadAnalyticsGoogle,
  getSearchNRFAnalyticsGoogle,
  getAdvancedSearchNRFAnalyticsGoogle,
  getReportsNRFAnalyticsGoogle,
  fixCountryCode,
} from './Utils/analyticsUtils';
import OrderDetailsRenderers from './Columns/OrderDetailsRenderers';
import MainGridHeader from './MainGrid/MainGridHeader';
import { addCurrencyToTotalColumn, mapServiceData } from './Utils/gridUtils';
import MainGridFooter from './MainGrid/MainGridFooter';
import MainGridFlyouts from './MainGrid/MainGridFlyouts';
import { getSessionInfo } from '../../../../utils/user/get';
import { usGet } from '../../../../utils/api';
import useGet from '../../hooks/useGet';
import Criteria from './Criteria/Criteria';
import { useGTMStatus } from '../../hooks/useGTMStatus';
import TemporarilyUnavailable from '../TemporarilyUnavailable/TemporarilyUnavailable';
import { LoaderIcon } from '../../../../fluentIcons/FluentIcons';
import { getTranslations, setDocumentTitle } from './Utils/translationsUtils';
import { updateUrl } from './Utils/utils';
import { downloadFile, openFile } from '../OrdersTrackingCommon/Utils/fileUtils';

function OrdersTrackingGrid(props) {
  console.log('OrdersTrackingGrid::init');

  const params = getUrlParamsCaseInsensitive();
  const isUnavailable = params.has('unavailable');

  const searchCriteria = useRef({ field: '', value: '' });
  const paginationAndSorting = useRef({
    pageNumber: params.get('page') || 1,
    sortBy: params.get('sortby') || 'created',
    sortDirection: params.get('sortdirection') || 'desc',
    queryCacheKey: params.get('q') || ''
  });
  const reportFilterValue = useRef({ value: '' });
  const filtersRefs = useRef({});
  const resetCallback = useRef(null);
  const shouldGoToFirstPage = useRef(false);
  const isOnSearchAction = useRef(false);
  const isOnPageChange = useRef(false);
  const rowsToGrayOutTDNameRef = useRef([]);

  const {
    setUserData,
    setCustomState,
    setRefinements,
    setFeatureFlags,
    setTranslations,
    hasRights,
    setMainGridRowsTotalCounter
  } = useOrderTrackingStore((st) => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore,
    { resetCallback, shouldGoToFirstPage, isOnSearchAction, isOnPageChange }
  );
  const userData = useOrderTrackingStore((st) => st.userData);
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasAccess = hasCanViewOrdersRights || hasOrderTrackingRights;

  const { isGTMReady } = useGTMStatus();

  const [paginationData, setPaginationData] = useState({
    totalCounter: null,
    pageCount: null,
    pageNumber: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [reloadAddedToGTM, setReloadAddedToGTM] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [sendAnalyticsDataHome, setSendAnalyticsDataHome] = useState(true);
  const [newItem, setNewItem] = useState(null);

  const componentProp = JSON.parse(props.componentProp);
  const gridPageSize = 25;

  const {
    noAccessProps,
    analyticsCategories,
  } = componentProp;

  const gridApiRef = useRef();

  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    suppressMultiSort: true,
    ensureDomOrder: true,
  };

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  const _onAfterGridInit = (config) => {
    console.log('OrdersTrackingGrid::_onAfterGridInit');

    onAfterGridInit(config);
    gridApiRef.current = config;
    const columnState = {
      state: [
        {
          colId: paginationAndSorting.current.sortBy,
          sort: paginationAndSorting.current.sortDirection,
        },
      ],
      defaultState: { sort: null },
    };

    config.columnApi.applyColumnState({ ...columnState });
  };

  const sendGTMDataOnError = () => {
    console.log('OrdersTrackingGrid::sendGTMDataOnError');

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

  const verifyIfPageNumberIsNotOutsideLimit = (ordersCountResponseContent) => {
    console.log('OrdersTrackingGrid::verifyIfPageNumberIsNotOutsideLimit');
    var correctPageNumber = Math.ceil(ordersCountResponseContent?.totalItems / gridPageSize);
    var newPageNumber = null;

    if (!paginationAndSorting.current.pageNumber) {
      newPageNumber = 1;
    }
    else if (correctPageNumber < paginationAndSorting.current.pageNumber) {
      newPageNumber = correctPageNumber;
    }

    if (newPageNumber) {
      console.log('OrdersTrackingGrid::verifyIfPageNumberIsNotOutsideLimit::page number needs to be corrected');
      paginationAndSorting.current.pageNumber = newPageNumber;
      updateUrl(paginationAndSorting, true);
    }
  }

  const storeQueryCacheKeyParameter = (queryCacheKey) => {
    console.log('OrdersTrackingGrid::storeQueryCacheKeyParameter');
    paginationAndSorting.current.queryCacheKey = queryCacheKey;
    updateUrl(paginationAndSorting, true);
  }

  const customRequestInterceptor = async () => {
    console.log('OrdersTrackingGrid::customRequestInterceptor');
    const gridApi = gridApiRef?.current?.api;

    gridApi.paginationSetPageSize(gridPageSize);

    const baseUrl = componentProp.uiCommerceServiceDomain;

    console.log('OrdersTrackingGrid::fetchOrdersCount');
    const ordersCountResponse = await fetchOrdersCount(
      baseUrl,
      filtersRefs,
      reportFilterValue.current?.value,
      searchCriteria
    );

    //TODOOOOOOOOOOOOOOOOOOOOOOOOOOO
    if (ordersCountResponse.error?.isError) {
      setResponseError(true);
      sendGTMDataOnError();
    } else {
      setResponseError(false);
      if (
        (response?.status && response?.status !== 200) ||
        response?.data?.content?.items?.length === 0 ||
        response?.data?.content?.totalItems === 0
      ) {
        sendGTMDataOnError();
      }
    }
    ////////////////////////////////////////

    const ordersCountResponseContent = ordersCountResponse?.data?.content;

    verifyIfPageNumberIsNotOutsideLimit(ordersCountResponseContent);

    console.log('OrdersTrackingGrid::fetchData|fetchReport');
    const response = reportFilterValue.current?.value
      ? await fetchReport(
        baseUrl,
        paginationAndSorting,
        reportFilterValue.current.value,
      )
      : await fetchData(
        baseUrl,
        paginationAndSorting,
        searchCriteria,
        filtersRefs
      );
    const responseContent = response?.data?.content;

    storeQueryCacheKeyParameter(responseContent?.queryCacheKey);

    // expand first details row
    setMainGridRowsTotalCounter(
      paginationAndSorting.current.pageNumber == 1 ? responseContent?.items?.length : null
    );

    console.log('OrdersTrackingGrid::customRequestInterceptor::paginationValue');
    setPaginationData({
      totalCounter: ordersCountResponseContent?.totalItems,
      pageCount: Math.ceil(ordersCountResponseContent?.totalItems / gridPageSize),
      pageNumber: parseInt(responseContent?.pageNumber) || 1,
      queryCacheKey: responseContent?.queryCacheKey,
    });

    return mapServiceData(response);
  };

  /**
   * Handler for sorting changes in the grid.
   * @param {Object} evt - The event object containing the grid state.
   */
  const onSortChanged = (evt) => {
    console.log('OrdersTrackingGrid::onSortChanged');

    // Retrieve the current state of all columns from the grid API
    const sortModelList = evt.columnApi.getColumnState();

    // Filter and map the columns that have a sorting direction specified
    const sortedModel = sortModelList
      .filter((o) => !!o.sort) // Keep only the columns that have a sort direction
      .map(({ colId, sort }) => ({ sortBy: colId, sortDirection: sort }))[0]; // Map the relevant properties to an object with sortBy and sortDirection

    // Check if there's a sorted model
    if (sortedModel) {
      // Get the current sortBy and sortDirection from paginationAndSorting
      const currentSortBy = paginationAndSorting.current.sortBy;
      const currentSortDirection = paginationAndSorting.current.sortDirection;

      // Check if the sort direction or column has changed
      if (currentSortBy !== sortedModel.sortBy ||
        currentSortDirection !== sortedModel.sortDirection) {
        // Update the paginationAndSorting object with the new sorting info
        paginationAndSorting.current.sortBy = sortedModel.sortBy;
        paginationAndSorting.current.sortDirection = sortedModel.sortDirection;

        // Update the URL to reflect the new sorting state
        updateUrl(paginationAndSorting);

        // Push the sorting information to Google Analytics
        pushDataLayerGoogle(getSortAnalyticsGoogle(`${sortedModel.sortDirection}: ${sortedModel.sortBy}`, 'Click'));
      }
    }
  };

  const onDataLoad = () => {
    setIsLoading(false);
  };

  /**
   * Downloads a file based on the provided parameters.
   * @param {string} flyoutType - The type of the flyout
   * @param {string} orderId - The ID of the order.
   * @param {string} selectedId - The ID of the selected file/item.
   */
  const downloadFileBlob = async (flyoutType, orderId, selectedId) => {
    console.log('OrdersTrackingGrid::downloadFileBlob::' + orderId);

    // Call the downloadFile function with the necessary parameters to download the file.
    await downloadFile(componentProps.uiCommerceServiceDomain, flyoutType, orderId, selectedId);
  };

  /**
   * Opens a PDF file based on the provided parameters.
   * @param {string} flyoutType - The type of the flyout
   * @param {string} orderId - The ID of the order.
   * @param {string} selectedId - The ID of the selected file/item.
   */
  const openFilePdf = async (flyoutType, orderId, selectedId) => {
    console.log('OrdersTrackingDetail::openFilePdf::' + orderId);

    // Call the openFile function with the necessary parameters to open the file in PDF format.
    await openFile(componentProps.uiCommerceServiceDomain, flyoutType, orderId, selectedId);
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
    const refinements = await fetchFiltersRefinements();

    setRefinements(refinements);

    setFeatureFlags(refinements?.featureFlags);

    // Fetch the UI translations from the server
    const uiTranslations = await getTranslations(gridConfig.uiLocalizeServiceDomain);

    // Set the fetched translations in the state
    setTranslations(uiTranslations);

    // Set the document title based on the fetched translations
    setDocumentTitle(uiTranslations);
  }, []);

  useEffect(() => {
    if (settingsResponse && params.has('notifications')) {
      triggerSettingsFlyout(settingsResponse);
    }
  }, [settingsResponse]);

  useEffect(() => {
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

  if (isUnavailable) {
    return <TemporarilyUnavailable noAccessProps={noAccessProps} />;
  }

  // Display a loader icon if the data is still loading
  if (!userData) {
    console.log('OrdersTrackingGrid::loading user data');
    return (<div className="cmp-order-tracking-grid"><LoaderIcon /></div>);
  }

  if (!hasAccess || !userData?.activeCustomer) {
    console.log('OrdersTrackingGrid::noAccessProps');
    return (<AccessPermissionsNeeded noAccessProps={noAccessProps} />);
  }

  return (
    <>
      <div className="cmp-order-tracking-grid">
        <Criteria
          searchParams={{
            reports: reportFilterValue,
            paginationAndSorting: paginationAndSorting,
            search: searchCriteria,
            filtersRefs: filtersRefs
          }}
        />
        <MainGridHeader
          onQueryChanged={onQueryChanged}
          analyticsCategories={analyticsCategories}
          isLoading={isLoading}
          searchParams={{
            reports: reportFilterValue,
            paginationAndSorting: paginationAndSorting,
            search: searchCriteria,
            filtersRefs: filtersRefs
          }}
          gridConfig={gridConfig}
          settings={settingsResponse}
          paginationData={paginationData}
        />
        <BaseGrid
          columnList={addCurrencyToTotalColumn(componentProp.columnList)}
          definitions={ordersTrackingDefinition(
            componentProp,
            openFilePdf,
            userData?.isInternalUser
          )}
          config={gridConfig}
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
          onQueryChanged={onQueryChanged}
          isLoading={isLoading}
          searchParams={{
            reports: reportFilterValue,
            paginationAndSorting: paginationAndSorting,
            search: searchCriteria,
            filtersRefs: filtersRefs
          }}
          paginationData={paginationData}
        />
      </div>
      <MainGridFlyouts
        downloadFileBlob={downloadFileBlob}
        gridConfig={gridConfig}
        openFilePdf={openFilePdf}
        onQueryChanged={onQueryChanged}
        settings={settingsResponse}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={handleAddNewItem}
      />
    </>
  );
}

export default OrdersTrackingGrid;