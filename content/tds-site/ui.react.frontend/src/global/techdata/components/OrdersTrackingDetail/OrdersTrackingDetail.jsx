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
} from '../OrdersTrackingGrid/utils/analyticsUtils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import { useGTMStatus } from '../../hooks/useGTMStatus';

function OrdersTrackingDetail(props) {
  const { id = '' } = getUrlParams();
  const gridRef = useRef();
  const rowsToGrayOutTDNameRef = useRef([]);
  const [newItem, setNewItem] = useState(null);
  const [content, setContent] = useState(null);
  const [subtotalValue, setSubtotalValue] = useState(
    null
  );
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
  const { setUserData } = useOrderTrackingStore((st) => st.effects);
  const userData = useOrderTrackingStore((st) => st.userData);

  const hasAIORights = userData?.roleList?.some(
    (role) => role.entitlement === 'AIO'
  );
  const hasOrderModificationRights = userData?.roleList?.some(
    (role) => role.entitlement === 'OrderModification'
  );

  const downloadFileBlob = async (flyoutType, orderId, selectedId) => {
    try {
      const url = `${componentProps.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
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

  function downloadAllFile(flyoutType, orderId, selectedId) {
    return downloadFileBlob(flyoutType, orderId, selectedId);
  }

  async function openFilePdf(flyoutType, orderId, selectedId) {
    const url = `${componentProps.uiCommerceServiceDomain}/v3/orders/downloaddocuments`;
    const singleDownloadUrl =
      url + `?Order=${orderId}&Type=${flyoutType}&id=${selectedId}`;
    await requestFileBlobWithoutModal(singleDownloadUrl, null, {
      redirect: true,
    });
  }

  const handleAddNewItem = (item) => {
    setNewItem(item);
  };

  useEffect(() => {
    getSessionInfo().then((data) => {
      setUserData(data[1]);
      if(isGTMReady) {
        pushDataLayerGoogle(
          getPageReloadAnalyticsGoogle({
            country: data[1]?.country,
            internalTraffic: data[1]?.isInternalUser,
            pageName: 'Order Details',
            number: id,
            userID: data[1]?.id,
            customerID: data[1]?.customers[0],
            industryKey: data[1]?.industryKey,
          })
        );
        pushDataLayerGoogle(getOrderDetailsAnalyticsGoogle(content?.orderNumber));
      }
    });
  }, [isGTMReady]);

  useEffect(async () => {
    try {
      const apiResponse = await usGet(`${config.orderDetailEndpoint}/${id}`);
      setContent(apiResponse?.data?.content);
    } catch (error) {
      console.error(error);
    }
  }, []);

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
              />
              <OrderTrackingDetailBody
                config={config}
                hasAIORights={hasAIORights}
                openFilePdf={openFilePdf}
                gridRef={gridRef}
                rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
                newItem={newItem}
                setSubtotalValue={setSubtotalValue}
              />
              <OrderTrackingDetailFooter
                config={config}
                content={content}
                subtotalValue={subtotalValue}
              />
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
      />
    </>
  );
}
export default OrdersTrackingDetail;
