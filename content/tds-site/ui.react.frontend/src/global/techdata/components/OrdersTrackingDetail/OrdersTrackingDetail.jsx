import React, { useState, useEffect, useRef } from 'react';
import OrderTrackingDetailHeader from './OrderTrackingDetailHeader';
import OrderTrackingDetailBody from './OrderTrackingDetailBody';
import OrderTrackingDetailFooter from './OrderTrackingDetailFooter';
import { getSessionInfo } from '../../../../utils/user/get';
import Flyouts from './Flyouts';
import { getPageReloadAnalyticsGoogle, fixCountryCode } from '../OrdersTrackingGrid/utils/analyticsUtils'; // move to common!
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import { useGTMStatus } from '../../hooks/useGTMStatus';
import { getUrlParamsCaseInsensitive } from '../../../../utils/index';
import { fetchOrderDetailsData } from './utils/fetchUtils';
import { updateUrl, mainDashboardUrl } from './utils/utils';
import { getOrderDetailsAnalyticsGoogle, pushDataLayerGoogle } from './utils/analyticsUtils';
import { fetchTranslations, setDocumentTitle } from './utils/translationsUtils';
import { downloadFile, openFile } from './utils/fileUtils';
import AccessPermissionsNeeded from './../AccessPermissionsNeeded/AccessPermissionsNeeded';
import TemporarilyUnavailable from '../TemporarilyUnavailable/TemporarilyUnavailable';

function OrdersTrackingDetail(props) {
  console.log('OrdersTrackingDetail::init');
  const params = getUrlParamsCaseInsensitive();
  const id = params.get('id');
  const isUnavailable = params.has('unavailable');

  const gridRef = useRef();
  const rowsToGrayOutTDNameRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [orderModifyHeaderInfo, setOrderModifyHeaderInfo] = useState(false);
  const { isGTMReady } = useGTMStatus();

  const componentProps = JSON.parse(props.componentProp);
  const config = {
    ...componentProps,
    productLines: { agGridLicenseKey: componentProps?.agGridLicenseKey },
    serverSide: false,
    paginationStyle: 'none',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
  };
  const { noAccessProps } = componentProps;
  const { setUserData, hasRights, setTranslations } =
    useOrderTrackingStore((st) => st.effects);

  const userData = useOrderTrackingStore((st) => st.userData);
  const hasAIORights = hasRights('AIO');
  const hasOrderModificationRights = hasRights('OrderModification');
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasAccess = hasCanViewOrdersRights || hasOrderTrackingRights;

  /**
   * Loads order details data for the specified orderId.
   * @param {string} orderId - The ID of the order to load details for.
   */
  const loadOrderDetailsData = async (orderId) => {
    console.log('OrdersTrackingDetail::loadOrderDetailsData::' + orderId);

    // Set isLoading state to true to indicate data loading is in progress
    setIsLoading(true);

    // Fetch order details data from the API
    const apiResponse = await fetchOrderDetailsData(config, orderId);

    // Set orderData state with the fetched data content
    setOrderData(apiResponse?.data?.content);

    // Handle different API response statuses
    if (apiResponse.status === 200) {
      // If successful response (200), push analytics data to Google Analytics
      pushDataLayerGoogle(
        getOrderDetailsAnalyticsGoogle(
          apiResponse.data.content.orderNumber,
          apiResponse.data.content.created
        )
      );
    } else if (apiResponse.status === 204) {
      // If no content (204), redirect to main dashboard URL with orderId
      window.location.href = mainDashboardUrl(orderId);
    } else {
      // For other error statuses, redirect to main dashboard URL without orderId
      window.location.href = mainDashboardUrl();
    }

    // Set isLoading state to false to indicate data loading has completed
    setIsLoading(false);
  };

  /**
   * Downloads a file based on the provided parameters.
   * @param {string} flyoutType - The type of the flyout
   * @param {string} orderId - The ID of the order.
   * @param {string} selectedId - The ID of the selected file/item.
   */
  const downloadAllFile = async (flyoutType, orderId, selectedId) => {
    console.log('OrdersTrackingDetail::downloadFileBlob::' + orderId);

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

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  /**
   * Handles the product change event by updating the order data and URL, 
   * then loading the order details for the given order ID.
   * @param {string} orderId - The ID of the order.
   */
  const onProductChange = (orderId) => {
    console.log('OrdersTrackingDetail::onProductChange');

    // Clear the current order data
    //setOrderData(null);

    // Update the URL with the new order ID and replace the current state in the browser history
    updateUrl(orderId, true);

    // Load the order details data for the new order ID
    loadOrderDetailsData(orderId);
  };

  useEffect(async () => {
    console.log('OrdersTrackingDetail::useEffect');

    // Fetch the UI translations from the server
    const uiTranslations = await fetchTranslations(config);

    // Set the fetched translations in the state
    setTranslations(uiTranslations);

    // Set the document title based on the fetched translations
    setDocumentTitle(uiTranslations);

    // Load the order details data for the given order ID
    loadOrderDetailsData(id);
  }, []);

  useEffect(() => {
    getSessionInfo().then((data) => {
      setUserData(data[1]);
      if (isGTMReady) {
        pushDataLayerGoogle(
          getPageReloadAnalyticsGoogle({
            country: fixCountryCode(data[1]?.country),
            internalTraffic: data[1]?.isInternalUser ? 'True' : 'False',
            pageName: 'Order Details',
            number: id,
            userID: data[1]?.id,
            customerID: data[1]?.customers[0],
            industryKey: data[1]?.industryKey,
          })
        );
      }
    });
  }, [isGTMReady]);

  useEffect(() => {
    console.log('OrdersTrackingDetail::orderModifyHeaderInfo');
    if (orderModifyHeaderInfo) {
      loadOrderDetailsData(id);
      setOrderModifyHeaderInfo(false);
    }
  }, [orderModifyHeaderInfo]);

  if (!hasAccess || !userData?.activeCustomer) {
    return (<AccessPermissionsNeeded noAccessProps={noAccessProps} />);
  }

  if (isUnavailable) {
    return <TemporarilyUnavailable noAccessProps={noAccessProps} />;
  }

  return (
    <div className="cmp-quote-preview cmp-order-preview">
      <OrderTrackingDetailHeader
        config={config}
        content={orderData}
        hasAIORights={hasAIORights}
        hasOrderModificationRights={hasOrderModificationRights}
        openFilePdf={openFilePdf}
        componentProps={componentProps}
        setOrderModifyHeaderInfo={setOrderModifyHeaderInfo}
        onProductChange={onProductChange}
        isLoading={isLoading}
      />
      <OrderTrackingDetailBody
        config={config}
        content={orderData}
        openFilePdf={openFilePdf}
        gridRef={gridRef}
        componentProps={componentProps}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        newItem={newItem}
        isLoading={isLoading}
      />
      <OrderTrackingDetailFooter
        config={config}
        content={orderData}
        isLoading={isLoading}
      />
      <Flyouts
        downloadAllFile={downloadAllFile}
        openFilePdf={openFilePdf}
        config={config}
        content={orderData}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={handleAddNewItem}
        setOrderModifyHeaderInfo={setOrderModifyHeaderInfo}
      />
    </div>
  );
}

export default OrdersTrackingDetail;