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
  fixCountryCode
} from '../OrdersTrackingGrid/utils/analyticsUtils';
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import { useGTMStatus } from '../../hooks/useGTMStatus';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { endpoints } from '../OrdersTrackingGrid/utils/orderTrackingUtils';
import { buildQueryString } from '../OrdersTrackingGrid/utils/gridUtils';
import { getHeaderInfo } from '../../../../utils/headers/get';

const translationDictionaries = [
  'OrderTracking.Details',
  'OrderTracking.MainGrid.Export'
];

function OrdersTrackingDetail(props) {
  const { id = '' } = getUrlParams();
  const gridRef = useRef();
  const rowsToGrayOutTDNameRef = useRef([]);
  const dNoteFailCounter = useRef(1);
  const invoiceFailCounter = useRef(1);
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
  const { setUserData, hasRights, setTranslations } = useOrderTrackingStore(
    (st) => st.effects
  );
  const userData = useOrderTrackingStore((st) => st.userData);
  const hasAIORights = hasRights('AIO');
  const hasOrderModificationRights = hasRights('OrderModification');

  const redirectToMainDashboard = () => {
    let currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    currentUrl.pathname = currentUrl.pathname.replace(
      '/order-details.html',
      '.html'
    );
    currentUrl.search = `?id=${id}`;
    window.location.href = currentUrl.href;
  };

  const headerRequest = async () => {
    try {
      const apiResponse = await usGet(
        `${config.uiCommerceServiceDomain}${endpoints.orderDetail}/${id}`
      );
      setContent(apiResponse?.data?.content);
      if (apiResponse.status === 204) {
        redirectToMainDashboard();
      }
    } catch (error) {
      console.error(error);
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
      if (response?.status === 204) {
        pushFailedDownloadGoogleAnalytics(
          flyoutType,
          false,
          dNoteFailCounter.current,
          invoiceFailCounter.current
        );
        if (flyoutType === 'DNote') {
          dNoteFailCounter.current++;
        } else if (flyoutType === 'Invoice') {
          invoiceFailCounter.current++;
        }
      }
    } catch (error) {
      pushFailedDownloadGoogleAnalytics(
        flyoutType,
        false,
        dNoteFailCounter.current,
        invoiceFailCounter.current
      );
      if (flyoutType === 'DNote') {
        dNoteFailCounter.current++;
      } else if (flyoutType === 'Invoice') {
        invoiceFailCounter.current++;
      }
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
      if (response?.status === 204) {
        pushFailedDownloadGoogleAnalytics(
          flyoutType,
          false,
          dNoteFailCounter.current,
          invoiceFailCounter.current
        );
        if (flyoutType === 'DNote') {
          dNoteFailCounter.current++;
        } else if (flyoutType === 'Invoice') {
          invoiceFailCounter.current++;
        }
      }
    } catch (error) {
      pushFailedDownloadGoogleAnalytics(
        flyoutType,
        false,
        dNoteFailCounter.current,
        invoiceFailCounter.current
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
    headerRequest();
    const uiTranslations = await fetchUITranslations();
    setTranslations(uiTranslations);
  }, []);

  useEffect(() => {
    document.title = getDictionaryValueOrKey(config?.labels?.pageTitle);
  }, []);

  useEffect(() => {
    if (orderModifyHeaderInfo) {
      headerRequest();
      setOrderModifyHeaderInfo(false);
    }
  }, [orderModifyHeaderInfo]);

  return (
    <>
      <div className="cmp-quote-preview cmp-order-preview">
        <section>
          {content && (
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
              />
              <OrderTrackingDetailBody
                config={config}
                content={content}
                openFilePdf={openFilePdf}
                gridRef={gridRef}
                rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
                newItem={newItem}
              />
              <OrderTrackingDetailFooter config={config} content={content} />
            </>
          )}
        </section>
      </div>
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
  );
}
export default OrdersTrackingDetail;
