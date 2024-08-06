import React, { useEffect, useRef, useState } from 'react';
import BaseGrid from '../BaseGrid/BaseGrid';
import { useOrderTrackingStore } from './../OrdersTrackingCommon/Store/OrderTrackingStore';
import { ordersTrackingDefinition } from './Utils/ordersTrackingDefinitions';
import { getUrlParamsCaseInsensitive } from '../../../../utils/index';
import AccessPermissionsNeeded from './../AccessPermissionsNeeded/AccessPermissionsNeeded';
import { fetchData, fetchOrdersCount } from './Utils/orderTrackingUtils';
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
import Header from './MainGrid/Header';
import Footer from './MainGrid/Footer';
import Flyouts from './MainGrid/Flyouts';
import { addCurrencyToTotalColumn, mapServiceData } from './Utils/gridUtils';
import { getSessionInfo } from '../../../../utils/user/get';
import { usGet } from '../../../../utils/api';
import useGet from '../../hooks/useGet';
import Criteria from './Criteria/Criteria';
import { useGTMStatus } from '../../hooks/useGTMStatus';
import { LoaderIcon } from '../../../../fluentIcons/FluentIcons';
import { getTranslations, setDocumentTitle } from './Utils/translationsUtils';
import { updateUrl, checkIfFetchCountIsRequired, checkIfFetchDataIsRequired } from './Utils/utils';
import { downloadFile, openFile } from '../OrdersTrackingCommon/Utils/fileUtils';
import { deepCopy } from '../OrdersTrackingCommon/Utils/utils';
import { isFilterNotEmpty } from './Filter/Utils/utils';
import { isReportFilterNotEmpty } from './Report/Utils/utils';
import { isSearchFilterNotEmpty } from './NewSearch/Utils/utils';

function OrdersTrackingGrid(props) {
  console.log('OrdersTrackingGrid::init');

  const params = getUrlParamsCaseInsensitive();

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
  console.log('OrdersTrackingGrid::translations');

  const userData = useOrderTrackingStore((st) => st.userData);
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasAccess = hasCanViewOrdersRights || hasOrderTrackingRights;

  // Criteria used for the Count query
  const countParams = useRef();

  // Criteria used for the Data query
  const dataParams = useRef();

  // Criteria used for the Data query
  const [searchParams, setSearchParams] = useState({
    paginationAndSorting: {
      pageNumber: params.get('page') || 1, // Page number for pagination
      sortBy: params.get('sortby') || 'created', // Field to sort by
      sortDirection: params.get('sortdirection') || 'desc', // Sorting direction (ascending or descending)
      queryCacheKey: params.get('q') || '' // Cache key for query
    }
  });

  // Data model collecting information about the Count query results
  // Allows retrieving information about the number of records, page count,
  // current page number, and caching key
  const [paginationData, setPaginationData] = useState({
    totalCounter: 0, // Total number of records
    pageCount: 0, // Total number of pages
    pageNumber: 1, // Current page number
    sortBy: params.get('sortby') || 'created', // Field to sort by
    sortDirection: params.get('sortdirection') || 'desc', // Sorting direction (ascending or descending)
    queryCacheKey: params.get('q') || '', // Cache key for query
  });

  // Currently used sort model, used to detect sort changes
  // and the need to send Google Analytics events
  const previousSortModel = useRef();

  // Information about whether the Grid has been initialized. 
  // When it is set to true, you can use references to the grid API.
  const [isGridReady, setIsGridReady] = useState(false);

  // Information about whether the grid is currently loading data.
  const [isLoading, setIsLoading] = useState(true);

  // Information about the need to reload data in the grid
  // The data in the grid will only be reloaded if the following criteria are met:
  // - The current state of countParams must be different from searchParams, or
  // - The current state of dataParams must be different from searchParams
  const [triggerLoadGridData, setTriggerLoadGridData] = useState(false);

  const { isGTMReady } = useGTMStatus();
  const [reloadAddedToGTM, setReloadAddedToGTM] = useState(false);
  const [sendAnalyticsDataHome, setSendAnalyticsDataHome] = useState(true);
  const [newItem, setNewItem] = useState(null);

  const componentProps = JSON.parse(props.componentProp);
  const gridPageSize = 25;

  const {
    noAccessProps,
    analyticsCategories,
  } = componentProps;

  const gridRef = useRef();

  const gridConfig = {
    ...componentProps,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    suppressMultiSort: true,
    ensureDomOrder: true,
    serverSide: false,
    itemsPerPage: 25
  };

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  /**
   * Callback function triggered after the grid is initialized.
   * Sets up the grid reference and applies initial column sorting based on search parameters.
   *
   * @param {Object} config - The grid configuration object provided after initialization.
   */
  const onAfterGridInit = (config) => {
    console.log('OrdersTrackingGrid::onAfterGridInit');

    // Store the grid configuration in the grid reference
    gridRef.current = config;

    // Define the initial column sorting state based on search parameters
    const columnState = {
      state: [
        {
          colId: searchParams.paginationAndSorting?.sortBy, // Column ID to sort by
          sort: searchParams.paginationAndSorting?.sortDirection, // Sort direction (asc/desc)
        },
      ],
      defaultState: { sort: null }, // Default state for columns not specified in 'state'
    };

    // Apply the column sorting state to the grid
    config.columnApi.applyColumnState({ ...columnState });

    // Mark the grid as ready for interaction
    setIsGridReady(true);
  };

  /**
   * Sends Google Tag Manager (GTM) data when no results are found.
   * This function checks if specific filters or search parameters are active,
   * and then pushes relevant data to the Google Tag Manager for analytics purposes
   * related to "No Results Found" scenarios.
   */
  const sendGTMNotResultFound = () => {
    console.log('OrdersTrackingGrid::sendGTMNotResultFound');

    // Check if the report filter is not empty and send corresponding GTM data
    if (isReportFilterNotEmpty(searchParams?.reports)) {
      pushDataLayerGoogle(
        getReportsNRFAnalyticsGoogle(searchParams?.reports.value)
      );
    }

    // Check if the search filter is not empty and send corresponding GTM data
    if (isSearchFilterNotEmpty(searchParams?.search)) {
      pushDataLayerGoogle(
        getSearchNRFAnalyticsGoogle(searchParams?.search?.field)
      );
    }

    // Check if any filters are applied and send corresponding GTM data
    if (isFilterNotEmpty(searchParams?.filters)) {
      pushDataLayerGoogle(getAdvancedSearchNRFAnalyticsGoogle());
    }
  };

  /**
   * Fetches the count of items and calculates the total number of pages.
   * @param {string} baseUrl - The base URL for the API request.
   * @param {Object} searchParams - The parameters used for the count request.
   * @returns {Promise<Object>} - A promise that resolves with the page count and total item count.
   */
  const fetchOrdersCountPromise = (baseUrl, searchParams) => {
    console.log('OrdersTrackingGrid::fetchOrdersCountPromise');

    // Update parameters for the count request
    countParams.current = deepCopy(searchParams);

    return fetchOrdersCount(baseUrl, searchParams)
      .then(response => {
        console.log('OrdersTrackingGrid::fetchOrdersCount');
        const countContent = response?.data?.content;
        const pageCount = Math.ceil(countContent?.totalItems / gridPageSize); // Calculate total pages
        const totalCounter = countContent?.totalItems; // Total number of items

        return { pageCount, totalCounter };
      })
      .catch(error => {
        console.error(error);
        return {}; // Return an empty object on error
      });
  };

  /**
   * Fetches the data for the grid and updates the grid rows.
   * @param {string} baseUrl - The base URL for the API request.
   * @param {Object} searchParams - The parameters used for the data request.
   * @returns {Promise<Object>} - A promise that resolves with the grid data, page number, and query cache key.
   */
  const fetchDataPromise = (baseUrl, searchParams) => {
    console.log('OrdersTrackingGrid::fetchDataPromise');

    // Update parameters for the data request
    dataParams.current = deepCopy(searchParams);

    return fetchData(baseUrl, searchParams)
      .then(response => {
        console.log('OrdersTrackingGrid::fetchData');
        const responseContent = response?.data?.content;
        const pageNumber = responseContent?.pageNumber;
        const queryCacheKey = responseContent?.queryCacheKey;
        const items = responseContent?.items ?? [];
        const totalItems = items.length;

        return { items, totalItems, pageNumber, queryCacheKey };
      })
      .catch(error => {
        console.error(error);
        return {}; // Return an empty object on error
      });
  };

  /**
   * Updates the pagination data in the state.
   * This includes total items count, number of pages, current page number, sorting options, and query cache key.
   * 
   * @param {number} pageCount - The total number of pages.
   * @param {number} totalCounter - The total number of items.
   * @param {number} pageNumber - The current page number.
   * @param {string} sortBy - The field by which the data is sorted.
   * @param {string} sortDirection - The direction of sorting (e.g., 'asc' for ascending or 'desc' for descending).
   * @param {string} queryCacheKey - The cache key for the query, used to avoid redundant data fetching.
   */
  const updatePaginationData = (pageCount, totalCounter, pageNumber, sortBy, sortDirection, queryCacheKey) => {
    console.log('OrdersTrackingGrid::updatePaginationData');

    setPaginationData(prev => ({
      ...prev,
      totalCounter: totalCounter || prev?.totalCounter,
      pageCount: pageCount || prev?.pageCount,
      pageNumber,
      sortBy,
      sortDirection,
      queryCacheKey
    }));
  };

  /**
   * Loads data for the grid, handles fetching counts and data, and updates the grid state.
   */
  const loadGridData = () => {
    console.log('OrdersTrackingGrid::loadGridData');

    const baseUrl = componentProps.uiCommerceServiceDomain;

    const promises = [];
    let pageCount, totalCounter, pageNumber, queryCacheKey;
    const sortBy = searchParams?.paginationAndSorting?.sortBy;
    const sortDirection = searchParams?.paginationAndSorting?.sortDirection;

    // Check if fetching count and/or data is required
    const shouldFetchCount = checkIfFetchCountIsRequired(searchParams, countParams?.current);
    const shouldFetchData = checkIfFetchDataIsRequired(searchParams, dataParams?.current);

    // Fetch count if required
    if (shouldFetchCount) {
      promises.push(
        fetchOrdersCountPromise(baseUrl, searchParams)
          .then(({ pageCount: fetchedPageCount, totalCounter: fetchedTotalCounter }) => {
            pageCount = fetchedPageCount;
            totalCounter = fetchedTotalCounter;
          })
      );
    }

    // Fetch data if required
    if (shouldFetchCount || shouldFetchData) {
      promises.push(
        fetchDataPromise(baseUrl, searchParams)
          .then(({ items, totalItems, pageNumber: fetchedPageNumber, queryCacheKey: fetchedQueryCacheKey }) => {
            pageNumber = fetchedPageNumber;
            queryCacheKey = fetchedQueryCacheKey;
            gridRef.current.api.setRowData(items);
          })
      );
    }

    // Execute all promises simultaneously
    if (promises.length > 0) {
      gridRef.current.api.showLoadingOverlay();

      Promise.all(promises)
        .catch(function (err) {
          console.log('OrdersTrackingGrid::loadGridData::fetch::error');
          sendGTMNotResultFound();
        })
        .finally(() => {
          console.log('OrdersTrackingGrid::loadGridData::fetch::finally');

          updatePaginationData(pageCount, totalCounter, pageNumber, sortBy, sortDirection, queryCacheKey);

          // Set total counter for the first details row if applicable
          setMainGridRowsTotalCounter(pageNumber === 1 ? totalCounter : null);

          // Hide loading overlay and handle no row message
          if (totalCounter == 0) {
            gridRef.current.handleNoRowMsg(totalCounter);
            sendGTMNotResultFound();
          }
          else
            gridRef.current.api.hideOverlay();

          // Notify that data loading is complete
          setIsLoading(false);
        });
    }
  };

  /**
   * Handler for sorting changes in the grid.
   * @param {Object} params - The event object containing the grid state.
   */
  const onSortChanged = (params) => {
    console.log('OrdersTrackingGrid::onSortChanged');

    // Retrieve the current state of all columns from the grid API
    const sortModelList = params.columnApi.getColumnState();

    // Filter and map the columns that have a sorting direction specified
    const sortedModel = sortModelList
      .filter((o) => !!o.sort) // Keep only the columns that have a sort direction
      .map(({ colId, sort }) => ({ sortBy: colId, sortDirection: sort }))[0]; // Map the relevant properties to an object with sortBy and sortDirection

    // Check if the sorting model has changed by comparing the previous sort model with the current one
    const isSortChanged = JSON.stringify(previousSortModel?.current) !== JSON.stringify(sortedModel);

    if (isSortChanged) {
      // Update the search parameters with the new sorting information
      setSearchParams(prev => ({
        ...prev,
        paginationAndSorting: {
          ...prev.paginationAndSorting,
          sortBy: sortedModel.sortBy,
          sortDirection: sortedModel.sortDirection,
        }
      }));

      // Push the sorting information to Google Analytics for tracking
      if (previousSortModel?.current?.sortBy && previousSortModel?.current?.sortDirection) {
        setTriggerLoadGridData(true);

        // Dont send GA event when its sort setup instead of change
        pushDataLayerGoogle(getSortAnalyticsGoogle(`${sortedModel.sortDirection}: ${sortedModel.sortBy}`, 'Click'));
      }
    }

    // Update the previous sort model to the current sort model
    previousSortModel.current = sortedModel;
  };

  /**
   * Displays a toaster notification with a message based on the download status.
   * 
   * @param {boolean} status - The status of the operation, where `true` indicates success and `false` indicates failure.
   * @param {string} success - The message to display when the operation is successful.
   * @param {string} failed - The message to display when the operation fails.
   */
  const showToasterWithMessage = (status, success, failed) => {
    const toaster = {
      isOpen: true, // Indicates that the toaster notification should be displayed.
      origin: 'downloadAllFile', // The origin or source of the notification.
      isAutoClose: true, // Determines if the toaster should automatically close after a certain time.
      message: status ? success : failed, // Sets the message based on the operation status.
      isSuccess: status // Boolean indicating whether the operation was successful.
    };

    setCustomState({ key: 'toaster', value: { ...toaster } }); // Updates the state to trigger the display of the toaster notification.
  };

  /**
   * Downloads a file based on the provided parameters.
   * @param {Object} translations - Translations.
   * @param {string} flyoutType - The type of the flyout.
   * @param {string} orderId - The ID of the order.
   * @param {string} selectedId - The ID of the selected file/item.
   */
  const downloadAllFile = async (translations, flyoutType, orderId, selectedId) => {
    console.log('OrdersTrackingGrid::downloadAllFile::' + orderId);

    // Display a toaster message indicating the download has started.
    showToasterWithMessage(true, translations?.Message_Download_Started);

    // Call the downloadFile function with the necessary parameters to download the file.
    const status = await downloadFile(componentProps.uiCommerceServiceDomain, flyoutType, orderId, selectedId);

    // Display a toaster message indicating whether the download was successful or failed.
    showToasterWithMessage(status, translations?.Message_Download_Success, translations?.Message_Download_Failed);
  };

  /**
   * Opens a PDF file based on the provided parameters.
   * @param {Object} translations - Translations.
   * @param {string} flyoutType - The type of the flyout
   * @param {string} orderId - The ID of the order.
   * @param {string} selectedId - The ID of the selected file/item.
   */
  const openFilePdf = async (translations, flyoutType, orderId, selectedId) => {
    console.log('OrdersTrackingGrid::openFilePdf::' + orderId);

    // Display a toaster message indicating the download has started.
    showToasterWithMessage(true, translations?.Message_Download_Started);

    // Call the openFile function with the necessary parameters to open the file in PDF format.
    const status = await openFile(componentProps.uiCommerceServiceDomain, flyoutType, orderId, selectedId);

    // Display a toaster message indicating whether the download was successful or failed.
    showToasterWithMessage(status, translations?.Message_Download_Success, translations?.Message_Download_Failed);
  };

  const fetchFiltersRefinements = async () => {
    const results = await usGet(
      `${componentProps.uiCommerceServiceDomain}/v3/refinements`
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

  /**
   * Handles the event when the query parameters are changed.
   * @param {Object} params - The new query parameters.
   */
  const onQueryChanged = (params) => {
    console.log('OrdersTrackingGrid::onQueryChanged');

    // Update the search parameters with the new query parameters
    if (params) { // When no criteria are provided -> use the ones that were last used
      setSearchParams(params);
    }

    // Trigger the loading of grid data
    setTriggerLoadGridData(true);
  }

  /**
   * Handles the initialization of the header.
   * This function is called when the header is first initialized.
   */
  const onHeaderInit = (filtersEmpty) => {
    console.log('OrdersTrackingGrid::onHeaderInit');

    // If no onQueryChange event has been triggered at startup
    // (meaning there were no specified filters), trigger the onQueryChange event
    if (filtersEmpty) {
      console.log('OrdersTrackingGrid::onHeaderInit::initial onQueryChanged');

      // Trigger the onQueryChanged function with the current search parameters
      onQueryChanged(searchParams);
    }
  }

  useEffect(async () => {
    console.log('OrdersTrackingGrid::useEffect');
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
    console.log('OrdersTrackingGrid::useEffect');

    // Check if the grid is not ready or if loading data should not be triggered
    // If either condition is true, exit the effect early
    if (!isGridReady || !triggerLoadGridData) {
      return;
    }

    // Call the function to load grid data
    loadGridData();

    // Reset the trigger to prevent re-loading the data until it is set to true again
    setTriggerLoadGridData(false);

  }, [isGridReady, triggerLoadGridData]); // Dependencies array to re-run the effect when isGridReady or triggerLoadGridData change

  useEffect(() => {
    console.log('OrdersTrackingGrid::useEffect::paginationAndSorting');

    // Check if paginationAndSorting exists in searchParams
    if (searchParams?.paginationAndSorting) {
      // Update the URL with the current pagination and sorting parameters
      updateUrl(paginationData, true);
    }
  }, [paginationData]);

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
          searchParams={searchParams}
          shouldUpdateCriteriaMessage={triggerLoadGridData}
        />
        <Header
          onInit={onHeaderInit}
          onQueryChanged={onQueryChanged}
          analyticsCategories={analyticsCategories}
          isLoading={isLoading}
          searchParams={searchParams}
          paginationData={paginationData}
          gridConfig={gridConfig}
          settings={settingsResponse}
        />
        <BaseGrid
          columnList={addCurrencyToTotalColumn(componentProps.columnList)}
          definitions={ordersTrackingDefinition(
            componentProps,
            openFilePdf,
            userData?.isInternalUser
          )}
          config={gridConfig}
          gridConfig={gridConfig}
          mapServiceData={mapServiceData}
          onSortChanged={onSortChanged}
          onAfterGridInit={onAfterGridInit}
          DetailRenderers={(props) => (
            <OrderDetailsRenderers
              {...props}
              config={gridConfig}
              openFilePdf={openFilePdf}
              rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
              newItem={newItem}
              onQueryChanged={onQueryChanged}
            />
          )}
        />
        <Footer
          onQueryChanged={onQueryChanged}
          isLoading={isLoading}
          paginationData={paginationData}
          searchParams={searchParams}
        />
      </div>
      <Flyouts
        downloadAllFile={downloadAllFile}
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