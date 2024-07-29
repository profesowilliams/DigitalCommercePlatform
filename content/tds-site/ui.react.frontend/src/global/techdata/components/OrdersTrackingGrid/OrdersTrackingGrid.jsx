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
import TemporarilyUnavailable from '../TemporarilyUnavailable/TemporarilyUnavailable';
import { LoaderIcon } from '../../../../fluentIcons/FluentIcons';
import { getTranslations, setDocumentTitle } from './Utils/translationsUtils';
import { updateUrl, checkIfCountIsRequired } from './Utils/utils';
import { downloadFile, openFile } from '../OrdersTrackingCommon/Utils/fileUtils';
import { deepCopy } from '../OrdersTrackingCommon/Utils/utils';

function OrdersTrackingGrid(props) {
  console.log('OrdersTrackingGrid::init');

  const params = getUrlParamsCaseInsensitive();
  const isUnavailable = params.has('unavailable');

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

  const userData = useOrderTrackingStore((st) => st.userData);
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasAccess = hasCanViewOrdersRights || hasOrderTrackingRights;

  const { isGTMReady } = useGTMStatus();

  const [countParams, setCountParams] = useState(); // current count params
  const [searchParams, setSearchParams] = useState({
    paginationAndSorting: {
      totalCounter: 0,
      pageCount: 0,
      pageNumber: params.get('page') || 1,
      sortBy: params.get('sortby') || 'created',
      sortDirection: params.get('sortdirection') || 'desc',
      queryCacheKey: params.get('q') || ''
    }
  });
  const [previousSortModel, setPreviousSortModel] = useState([]);

  const [isGridReady, setIsGridReady] = useState(false);
  const [isInitialRequestPerformed, setIsInitialRequestPerformed] = useState(false);
  const [triggerCount, setTriggerCount] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);
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

  const gridRef = useRef();

  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    suppressMultiSort: true,
    ensureDomOrder: true,
    serverSide: true,
    itemsPerPage: 25
  };

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  const _onAfterGridInit = (config) => {
    console.log('OrdersTrackingGrid::_onAfterGridInit');

    gridRef.current = config;
    const columnState = {
      state: [
        {
          colId: searchParams.paginationAndSorting?.sortBy,
          sort: searchParams.paginationAndSorting?.sortDirection,
        },
      ],
      defaultState: { sort: null },
    };

    config.columnApi.applyColumnState({ ...columnState });

    setIsGridReady(true);
  };

  //const sendGTMDataOnError = () => {
  //  console.log('OrdersTrackingGrid::sendGTMDataOnError');

  //  if (reportFilterValue?.current?.value) {
  //    pushDataLayerGoogle(
  //      getReportsNRFAnalyticsGoogle(reportFilterValue.current.value)
  //    );
  //  }
  //  if (searchCriteria?.current?.field) {
  //    pushDataLayerGoogle(
  //      getSearchNRFAnalyticsGoogle(searchCriteria?.current?.field)
  //    );
  //  }
  //  const filtersStatusAndType =
  //    (filtersRefs?.current?.type ?? '') + (filtersRefs?.current?.status ?? '');

  //  const dateFilters = Object.entries(filtersRefs?.current).filter(
  //    (entry) => filtersDateGroup.includes(entry[0]) && Boolean(entry[1])
  //  );

  //  if (filtersStatusAndType !== '' || dateFilters.length > 0) {
  //    pushDataLayerGoogle(getAdvancedSearchNRFAnalyticsGoogle());
  //  }
  //};

  useEffect(() => {
    console.log('OrdersTrackingGrid::useEffect');

    if (!isGridReady || !triggerSearch) {
      console.log('OrdersTrackingGrid::useEffect::wait');
      setTriggerSearch(false);
      return;
    }

    console.log('OrdersTrackingGrid::useEffect::go');

    const datasource = {
      getRows: (params) => {
        console.log('OrdersTrackingGrid::getRows');

        if (!isInitialRequestPerformed && params.api.context.suppressSearchAfterSortChange) {
          params.api.context.suppressSearchAfterSortChange = false;
          console.log('OrdersTrackingGrid::getRows::skip');
          return;
        }

        gridRef.current.api.showLoadingOverlay();

        const baseUrl = componentProp.uiCommerceServiceDomain;

        // Create an array to hold promises
        const promises = [];
        let pageCount, totalCounter, pageNumber, queryCacheKey;

        // Conditionally add fetchOrdersCount promise
        if (checkIfCountIsRequired(searchParams, countParams)) {
          console.log('OrdersTrackingGrid::fetchOrdersCountPromise');
          const fetchOrdersCountPromise = fetchOrdersCount(baseUrl, searchParams)
            .then(response => {
              console.log('OrdersTrackingGrid::fetchOrdersCount');

              const countContent = response?.data?.content;
              pageCount = Math.ceil(countContent?.totalItems / gridPageSize);
              totalCounter = countContent?.totalItems;
            })
            .catch(error => {
              console.error(error);
            });

          promises.push(fetchOrdersCountPromise);
        }

        // Add fetchData promise
        console.log('OrdersTrackingGrid::fetchDataPromise');
        const fetchDataPromise = fetchData(baseUrl, searchParams)
          .then(response => {
            console.log('OrdersTrackingGrid::fetchData');

            const responseContent = response?.data?.content;
            pageNumber = responseContent?.pageNumber;
            queryCacheKey = responseContent?.queryCacheKey;

            return { items: responseContent?.items, totalItems: responseContent?.items?.length };
          })
          .then(data => {
            params.successCallback(data.items ?? [], data.totalItems ?? 0);
          })
          .catch(error => {
            console.error(error);
            params.failCallback();
          });

        promises.push(fetchDataPromise);

        // Execute all promises simultaneously
        Promise.all(promises)
          .finally(() => {

            console.log('OrdersTrackingGrid::fetch::finally');

            setTriggerSearch(false);

            setCountParams(searchParams);
            setSearchParams(prev => ({
              ...prev,
              paginationAndSorting: {
                ...prev.paginationAndSorting,
                totalCounter: totalCounter || prev.paginationAndSorting?.totalCounter,
                pageCount: pageCount || prev.paginationAndSorting?.pageCount,
                pageNumber: pageNumber,
                queryCacheKey: queryCacheKey,
              }
            }));

            // Expand first details row
            setMainGridRowsTotalCounter(pageNumber == 1 ? totalCounter : null);

            // This block will be executed after all promises are resolved or any of them fails
            gridRef.current.api.hideOverlay();

            const countItems = params.api.getDisplayedRowCount();
            gridRef.current.handleNoRowMsg(countItems);

            setIsLoading(false);
          });
      },
    };

    gridRef.current.api.setServerSideDatasource(datasource);

  }, [isGridReady, triggerSearch]);

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
    const isSortChanged = JSON.stringify(previousSortModel) !== JSON.stringify(sortedModel);

    if (isSortChanged) {
      // Set a flag in the grid context to stop automatic data processing
      params.api.context.suppressSearchAfterSortChange = true;

      // Update the search parameters with the new sorting information
      setSearchParams(prev => ({
        ...prev,
        paginationAndSorting: {
          ...prev.paginationAndSorting,
          sortBy: sortedModel.sortBy,
          sortDirection: sortedModel.sortDirection,
        }
      }));

      // Trigger a search operation by setting the triggerSearch state to true
      setTriggerSearch(true);

      // Push the sorting information to Google Analytics for tracking
      pushDataLayerGoogle(getSortAnalyticsGoogle(`${sortedModel.sortDirection}: ${sortedModel.sortBy}`, 'Click'));

      // Update the previous sort model to the current sort model
      setPreviousSortModel(sortedModel);
    }
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

  const onQueryChanged = (params) => {
    console.log('OrdersTrackingDetail::onQueryChanged');

    //const criteriaChangesTriggerNewCount = checkIfCountIsRequired(params, countParams);

    //console.log('OrdersTrackingDetail::onQueryChanged::performCount[' + criteriaChangesTriggerNewCount + ']');

    setSearchParams(params);
    setTriggerSearch(true);
    //setTriggerCount(criteriaChangesTriggerNewCount);
    setIsInitialRequestPerformed(true);
  }

  const onHeaderInit = () => {
    console.log('OrdersTrackingDetail::onHeaderInit');

    if (!isInitialRequestPerformed) {
      console.log('OrdersTrackingDetail::onHeaderInit::initial onQueryChanged');
      onQueryChanged(searchParams);
    }
  }

  useEffect(() => {
    console.log('OrdersTrackingDetail::useEffect::paginationAndSorting');
    if (searchParams?.paginationAndSorting) {
      updateUrl(searchParams.paginationAndSorting, true);
    }
  }, [searchParams?.paginationAndSorting]);

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
          searchParams={searchParams}
        />
        <Header
          onInit={onHeaderInit}
          onQueryChanged={onQueryChanged}
          analyticsCategories={analyticsCategories}
          isLoading={isLoading}
          searchParams={searchParams}
          gridConfig={gridConfig}
          settings={settingsResponse}
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
          mapServiceData={mapServiceData}
          onSortChanged={onSortChanged}
          onAfterGridInit={_onAfterGridInit}
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
        <Footer
          onQueryChanged={onQueryChanged}
          isLoading={isLoading}
          searchParams={searchParams}
        />
      </div>
      <Flyouts
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