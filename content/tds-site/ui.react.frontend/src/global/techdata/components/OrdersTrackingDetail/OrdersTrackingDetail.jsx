import React, { useState, useEffect, useRef } from 'react';
import useGet from '../../hooks/useGet';
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
} from '../OrdersTrackingGrid/utils/analyticsUtils';

function OrdersTrackingDetail(props) {
  const { id = '' } = getUrlParams();
  const [userData, setUserData] = useState(null);
  const gridRef = useRef();
  const rowsToGrayOutTDNameRef = useRef([]);
  const [newItem, setNewItem] = useState(null);

  const componentProps = JSON.parse(props.componentProp);
  const config = {
    ...componentProps,
    productLines: { agGridLicenseKey: componentProps?.agGridLicenseKey },
    serverSide: false,
    paginationStyle: 'none',
  };
  const [apiResponse] = useGet(`${config.uiServiceEndPoint}?id=${id}`);
  const hasAIORights = userData?.roleList?.some(
    (role) => role.entitlement === 'AIO'
  );
  const hasOrderModificationRights = userData?.roleList?.some(
    (role) => role.entitlement === 'OrderModification'
  );
  const content = apiResponse?.content;

  const downloadFileBlob = async (flyoutType, orderId, selectedId) => {
    try {
      const url = componentProps.ordersDownloadDocumentsEndpoint || 'nourl';
      const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
      const downloadOrderInvoicesUrl =
        url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;
      const name = `${flyoutType}.zip`;
      await requestFileBlobWithoutModal(downloadOrderInvoicesUrl, name, {
        redirect: false,
      });
    } catch (error) {
      console.error('Error', error);
    }
  };

  function downloadAllFile(flyoutType, orderId, selectedId) {
    return downloadFileBlob(flyoutType, orderId, selectedId);
  }

  async function openFilePdf(flyoutType, orderId, selectedId) {
    const url = componentProps.ordersDownloadDocumentsEndpoint || 'nourl';
    const singleDownloadUrl =
      url + `?Order=${orderId}&Type=${flyoutType}&id=${selectedId}`;
    const name = `${orderId}.pdf`;
    await requestFileBlobWithoutModal(singleDownloadUrl, name, {
      redirect: true,
    });
  }

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  useEffect(() => {
    getSessionInfo().then((data) => {
      setUserData(data[1]);
      window?.td &&
        pushDataLayerGoogle(
          getPageReloadAnalyticsGoogle({
            country: data[1]?.country,
            internalTraffic: data[1]?.isInternal,
            pageName: 'Order Details',
            number: id,
            userID: td?.userId ?? '',
            customerID: td?.customerId ?? '',
            industryKey: td?.industryKey ?? '',
          })
        );
    });
  }, [window?.td]);

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
              />
              <OrderTrackingDetailBody
                content={content}
                config={config}
                hasAIORights={hasAIORights}
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
        hasAIORights={hasAIORights}
        content={content}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        userData={userData}
        addNewItem={handleAddNewItem}
      />
    </>
  );
}
export default OrdersTrackingDetail;
