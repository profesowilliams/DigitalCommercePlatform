import React, { useState, useEffect, useRef } from 'react';
import Link from '../Widgets/Link';
import SoldToCard from './SoldToCard';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';
import useGet from '../../hooks/useGet';
import OrderAcknowledgementCard from './OrderAcknowledgementCard';
import ContactCard from './ContactCard';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getUrlParams } from "../../../../utils";


function OrdersTrackingDetail(props) {
  const { id = "" } = getUrlParams();
  const componentProps = JSON.parse(props.componentProp);
  const config = {
    ...componentProps,
    serverSide: false,
    paginationStyle: 'none',
  };

  const [apiResponse, isLoading, error] = useGet(
    `${config.uiServiceEndPoint}?id=${id}`
  );
 
  return (
    <div className="cmp-quote-preview cmp-order-preview">
      <section>
        <div className="cmp-orders-qp__config-grid">
          <div className="header-container">
            <div className="image-container">
              <Link
                variant="back-to-orders"
                href={config?.ordersUrl || '#'}
                underline="none"
              >
                <i className="fas fa-chevron-left"></i>
                {getDictionaryValueOrKey(config?.labels?.detailsBack)}
              </Link>
            </div>
            <div className="export-container">
              <div>
                <span className="quote-preview-bold">
                  {apiResponse?.content.status}
                </span>
                <span className="quote-preview-bold">
                  {apiResponse?.content.orderNumber &&
                    ` | ${getDictionaryValueOrKey(
                      config.labels?.detailsOrderNo
                    )}: `}
                </span>
                <span className="quote-preview">
                  {apiResponse?.content.orderNumber}
                </span>
              </div>
              <span className="quote-actions">
                {/* {getDictionaryValueOrKey(config?.labels?.detailsActions)} */}
              </span>
            </div>
          </div>
          <div className="info-container">
            <SoldToCard
              soldTo={apiResponse?.content?.shipTo || {}}
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
          <div className="details-container">
            <span className="details-preview">
              {getDictionaryValueOrKey(config?.labels?.detailsLineHeader)}
            </span>
          </div>
          {apiResponse && (
            <OrdersTrackingDetailGrid
              data={apiResponse.content}
              gridProps={config}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default OrdersTrackingDetail;
