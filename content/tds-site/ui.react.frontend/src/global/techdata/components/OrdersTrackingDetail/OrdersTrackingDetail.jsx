import React, { useState, useEffect } from 'react';
import SoldToCard from './SoldToCard';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';
import useGet from '../../hooks/useGet';
import OrderAcknowledgementCard from './OrderAcknowledgementCard';
import ContactCard from './ContactCard';
import { getUrlParams } from '../../../../utils';
import OrderTrackingDetailHeader from './OrderTrackingDetailHeader';
import OrderTrackingDetailFooter from './OrderTrackingDetailFooter';
import OrderTrackingContainer from './OrderTrackingContainer';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import { requestFileBlobWithoutModal } from '../../../../utils/utils';
import OrderModificationFlyout from './ModificationFlyout/OrderModificationFlyout';

function OrdersTrackingDetail(props) {
  const { id = '' } = getUrlParams();
  const [userData, setUserData] = useState(null);
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);

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

  const downloadFileBlob = async (flyoutType, orderId) => {
    try {
      const url = componentProps.ordersDownloadDocumentsEndpoint || 'nourl';
      const mapIds = orderId.map((ids) => `&id=${ids}`).join('');
      const downloadOrderInvoicesUrl = url + `?Type=${flyoutType}${mapIds}`;
      const name = `${flyoutType}.zip`;
      await requestFileBlobWithoutModal(downloadOrderInvoicesUrl, name, {
        redirect: false,
      });
    } catch (error) {
      console.error('Error', error);
    }
  };

  function downloadAllFile(flyoutType, orderId) {
    return downloadFileBlob(flyoutType, orderId);
  }

  async function openFilePdf(flyoutType, orderId) {
    const url = componentProps.ordersDownloadDocumentsEndpoint || 'nourl';
    const singleDownloadUrl = url + `?Type=${flyoutType}&id=${orderId[0]}`;
    const name = `${orderId[0]}.pdf`;
    await requestFileBlobWithoutModal(singleDownloadUrl, name, {
      redirect: true,
    });
  }

  useEffect(() => {
    window.getSessionInfo &&
      window.getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
  }, []);

  return (
    <div className="cmp-quote-preview cmp-order-preview">
      <section>
        <div className="cmp-orders-qp__config-grid">
          <OrderTrackingDetailHeader
            config={config}
            apiResponse={apiResponse}
            hasAIORights={hasAIORights}
            hasOrderModificationRights={hasOrderModificationRights}
            openFilePdf={openFilePdf}
          />
          <div className="info-container">
            <SoldToCard shipTo={apiResponse?.content?.shipTo} config={config} />
            <OrderAcknowledgementCard
              content={apiResponse?.content}
              config={config}
            />
            <ContactCard content={apiResponse?.content} config={config} />
          </div>
        </div>
        <div className="cmp-orders-qp__grid cmp-order-preview">
          <OrderTrackingContainer config={config} />
          {apiResponse && (
            <OrdersTrackingDetailGrid
              data={apiResponse.content}
              gridProps={config}
            />
          )}
        </div>
        <div className="footer-container">
          <OrderTrackingDetailFooter
            config={config}
            apiResponse={apiResponse}
          />
        </div>
        <DNotesFlyout
          store={useOrderTrackingStore}
          dNotesFlyout={config?.dNotesFlyout}
          dNoteColumnList={config?.dNoteColumnList}
          subheaderReference={document.querySelector('.subheader > div > div')}
          isTDSynnex={isTDSynnex}
          downloadAllFile={(flyoutType, orderId) =>
            downloadAllFile(flyoutType, orderId)
          }
          openFilePdf={(flyoutType, orderId) =>
            openFilePdf(flyoutType, orderId)
          }
        />
      </section>
      <OrderModificationFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        items={apiResponse?.content?.items}
        labels={config.labels}
      />
    </div>
  );
}
export default OrdersTrackingDetail;
