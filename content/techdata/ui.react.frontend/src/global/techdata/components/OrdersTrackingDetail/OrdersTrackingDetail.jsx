import React from 'react';
import SoldToCard from './SoldToCard';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';
import useGet from '../../hooks/useGet';
import OrderAcknowledgementCard from './OrderAcknowledgementCard';
import ContactCard from './ContactCard';
import { getUrlParams } from '../../../../utils';
import { useStore } from '../../../../utils/useStore';
import OrderTrackingDetailHeader from './OrderTrackingDetailHeader';
import OrderTrackingDetailFooter from './OrderTrackingDetailFooter';
import OrderTrackingContainer from './OrderTrackingContainer';

function OrdersTrackingDetail(props) {
  const { id = '' } = getUrlParams();
  const componentProps = JSON.parse(props.componentProp);
  const config = {
    ...componentProps,
    productLines: { agGridLicenseKey: componentProps?.agGridLicenseKey },
    serverSide: false,
    paginationStyle: 'none',
  };
  const [apiResponse] = useGet(`${config.uiServiceEndPoint}?id=${id}`);
  const userData = useStore((state) => state.userData);
  const hasAIORights = userData?.roleList?.some(
    (role) => role.entitlement === 'AIO'
  );
  const hasOrderModificationRights = userData?.roleList?.some(
    (role) => role.entitlement === 'OrderModification'
  );
  return (
    <div className="cmp-quote-preview cmp-order-preview">
      <section>
        <div className="cmp-orders-qp__config-grid">
          <OrderTrackingDetailHeader
            config={config}
            apiResponse={apiResponse}
            hasAIORights={hasAIORights}
            hasOrderModificationRights={hasOrderModificationRights}
          />
          <div className="info-container">
            <SoldToCard
              shipTo={apiResponse?.content?.shipTo || {}}
              config={config}
            />
            <OrderAcknowledgementCard
              content={apiResponse?.content || {}}
              config={config}
            />
            <ContactCard content={apiResponse?.content || {}} config={config} />
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
      </section>
    </div>
  );
}
export default OrdersTrackingDetail;
