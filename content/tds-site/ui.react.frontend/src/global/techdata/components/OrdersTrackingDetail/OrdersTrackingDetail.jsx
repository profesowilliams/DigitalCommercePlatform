import React, { useState, useEffect, useRef } from 'react';
import { usGet } from '../../../../utils/api';
import { getUrlParams } from '../../../../utils';
import OrderTrackingDetailHeader from './OrderTrackingDetailHeader';
import OrderTrackingDetailFooter from './OrderTrackingDetailFooter';
import { requestFileBlobWithoutModal } from '../../../../utils/utils';
import { getSessionInfo } from '../../../../utils/user/get';
import OrderTrackingDetailBody from './OrderTrackingDetailBody';
import Flyouts from './Flyouts';
import {
  getPageReloadAnalyticsGoogle,
  pushDataLayerGoogle,
  pushFailedDownloadGoogleAnalytics,
  pushSuccessDownloadGoogleAnalytics,
  fixCountryCode
} from '../OrdersTrackingGrid/utils/analyticsUtils';
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import { useGTMStatus } from '../../hooks/useGTMStatus';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { endpoints } from '../OrdersTrackingGrid/utils/orderTrackingUtils';
import { buildQueryString } from '../OrdersTrackingGrid/utils/gridUtils';
import { getHeaderInfo } from '../../../../utils/headers/get';
import { getUrlParamsCaseInsensitive } from '../../../../utils/index';

const translationDictionaries = [
  'OrderTracking.Details',
  'OrderTracking.MainGrid.Export'
];

function OrdersTrackingDetail(props) {
  console.log('OrdersTrackingDetail::init');
  const params = getUrlParamsCaseInsensitive();
  const id = params.get('id');
  const gridRef = useRef();
  const rowsToGrayOutTDNameRef = useRef([]);
  const dNoteFailCounter = useRef(1);
  const invoiceFailCounter = useRef(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState(null);
  const [content, setContent] = useState(null);
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
  const { setUserData, hasRights, setTranslations, setIsAvailable } =
    useOrderTrackingStore((st) => st.effects);
  const userData = useOrderTrackingStore((st) => st.userData);
  const hasAIORights = hasRights('AIO');
  const hasOrderModificationRights = hasRights('OrderModification');

  const redirectToMainDashboard = (orderId) => {
    let currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    currentUrl.pathname = currentUrl.pathname.replace(
      '/order-details.html',
      '.html'
    );
    currentUrl.search = `?id=${orderId}`;
    window.location.href = currentUrl.href;
  };

  const headerRequest = async (orderId) => {
    setIsLoading(true);
    console.log('OrdersTrackingDetail::headerRequest');

    try {
      const apiResponse = await usGet(
        `${config.uiCommerceServiceDomain}${endpoints.orderDetail}/${orderId}`
      );
      setContent(apiResponse?.data?.content);
      if (apiResponse.status === 204) {
        redirectToMainDashboard(orderId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFileBlob = async (flyoutType, orderId, selectedId) => {
    let response = null;
    try {
      const url = `${componentProps.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
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
      if (response?.status === 200) {
        const successCounter =
          response?.headers['Ga-Download-Documents-Success'];
        pushSuccessDownloadGoogleAnalytics(
          flyoutType,
          false,
          successCounter,
          orderId,
          mapIds
        );
      } else if (response?.status === 204) {
        const failCounter = response?.headers['Ga-Download-Documents-Fail'];
        pushFailedDownloadGoogleAnalytics(
          flyoutType,
          false,
          failCounter,
          orderId,
          mapIds
        );
        setIsAvailable(false);
      }
    } catch (error) {
      pushFailedDownloadGoogleAnalytics(flyoutType, false, 1, orderId, mapIds);
      if (flyoutType === 'DNote') {
        dNoteFailCounter.current++;
      } else if (flyoutType === 'Invoice') {
        invoiceFailCounter.current++;
      }
      setIsAvailable(false);
      console.error('Error', error);
    }
  };

  function downloadAllFile(flyoutType, orderId, selectedId) {
    return downloadFileBlob(flyoutType, orderId, selectedId);
  }

  async function openFilePdf(flyoutType, orderId, selectedId) {
    const url = `${componentProps.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
    const singleDownloadUrl =
      url + `?Order=${orderId}&Type=${flyoutType}&id=${selectedId}`;
    let response = null;
    try {
      response = await requestFileBlobWithoutModal(singleDownloadUrl, null, {
        redirect: true,
      });
      if (response?.status === 200) {
        const successCounter = response?.headers['Ga-Download-Documents-Success'];
        pushSuccessDownloadGoogleAnalytics(
          flyoutType,
          false,
          successCounter,
          orderId,
          selectedId
        );
      } else if (response?.status === 204) {
        const failCounter = response?.headers['Ga-Download-Documents-Fail'];
        pushFailedDownloadGoogleAnalytics(
          flyoutType,
          false,
          failCounter,
          orderId,
          selectedId
        );
        setIsAvailable(false);
      }
    } catch (error) {
      pushFailedDownloadGoogleAnalytics(
        flyoutType,
        false,
        1,
        orderId,
        selectedId
      );
      if (flyoutType === 'DNote') {
        dNoteFailCounter.current++;
      } else if (flyoutType === 'Invoice') {
        invoiceFailCounter.current++;
      }
      setIsAvailable(false);
    }
  }

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  const fetchUITranslations = async () => {
    const results = await usGet(
      `${componentProps.uiLocalizeServiceDomain}/v1` +
      buildQueryString(translationDictionaries) +
      `&cacheInSec=900&country=` + getHeaderInfo().acceptLanguage
    );
    return results.data;
  };

  const onProductChange = (orderId) => {
    console.log('OrdersTrackingDetail::onProductChange');
    setContent(null);
    updateUrl(orderId, true);
    headerRequest(orderId);
  };

  const updateUrl = (id, replaceState) => {
    console.log('OrdersTrackingDetail::updateUrl');

    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Update id
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);

    // If the URL has changed, update the browser history
    if (url.toString() !== currentUrl.toString()) {
      if (replaceState) {
        // Use pushState to add a new entry to the browser history
        window.history.pushState(null, '', url.toString());
      } else {
        // Use replaceState to modify the current entry in the browser history
        window.history.replaceState(null, '', url.toString());
      }
    }
  };

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

  useEffect(async () => {
    console.log('OrdersTrackingDetail::useEffect::headerRequest');
    headerRequest(id);
    const uiTranslations = await fetchUITranslations();
    setTranslations(uiTranslations);
  }, []);

  useEffect(() => {
    console.log('OrdersTrackingDetail::useEffect::title');
    document.title = getDictionaryValueOrKey(config?.labels?.pageTitle);
  }, []);

  useEffect(() => {
    console.log('OrdersTrackingDetail::orderModifyHeaderInfo');
    if (orderModifyHeaderInfo) {
      headerRequest(id);
      setOrderModifyHeaderInfo(false);
    }
  }, [orderModifyHeaderInfo]);

  return (
    <>
      <div className="cmp-quote-preview cmp-order-preview">
        <section>
          {!isLoading && content && (
            <>
              <OrderTrackingDetailHeader
                config={config}
                content={content}
                hasAIORights={hasAIORights}
                hasOrderModificationRights={hasOrderModificationRights}
                openFilePdf={openFilePdf}
                componentProps={componentProps}
                userData={userData}
                setOrderModifyHeaderInfo={setOrderModifyHeaderInfo}
                onProductChange={onProductChange}
              />
              <OrderTrackingDetailBody
                config={config}
                content={content}
                openFilePdf={openFilePdf}
                gridRef={gridRef}
                componentProps={componentProps}
                rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
                newItem={newItem}
              />
              <OrderTrackingDetailFooter
                config={config}
                content={content} />
              <Flyouts
                downloadAllFile={downloadAllFile}
                openFilePdf={openFilePdf}
                config={config}
                content={content}
                gridRef={gridRef}
                rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
                addNewItem={handleAddNewItem}
                setOrderModifyHeaderInfo={setOrderModifyHeaderInfo}
              />
            </>
          )}
          {isLoading && (<div>Loading...</div>)}
        </section>
      </div>
    </>
  );
}
export default OrdersTrackingDetail;
