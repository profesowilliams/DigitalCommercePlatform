import React, { useState, useEffect, useRef } from 'react';
import Link from '../Widgets/Link';
import SoldToCard from './SoldToCard';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';
import Grid from '../Grid/Grid';
import useGet from '../../hooks/useGet';
import OrderAcknowledgementCard from './OrderAcknowledgementCard';
import ContactCard from './ContactCard';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getUrlParams } from "../../../../utils";


function OrdersTrackingDetail(props) {
  const { id = "" } = getUrlParams();
  const componentProps = JSON.parse(props.componentProp);
  const [gridData, setGridData] = useState(null);
  const config = {
    ...componentProps,
    serverSide: false,
    paginationStyle: 'none',
  };

  const [apiResponse, isLoading, error] = useGet(
    `${config.uiServiceEndPoint}?id=${id}`
  );

  useEffect(() => {
    if (apiResponse) {
      setGridData(apiResponse.content.items);
    }
  }, [apiResponse]);
 
  return (
    <div className="cmp-quote-preview cmp-order-preview">
      <section>
        <div className="cmp-orders-qp__config-grid">
          <div className="header-container">
            <div className="image-container">
              <Link variant="back-to-renewal" href={config?.labels?.ordersUrl} underline="none">
                <i className="fas fa-chevron-left"></i>
                {getDictionaryValueOrKey(config?.labels?.detailsBack)}
              </Link>
            </div>
            <div className="export-container">
              <span className="quote-preview">
                {/* {getDictionaryValueOrKey(config?.labels?.detailsOrderNo)}{' '} */}
                Open  |  Order №:
                {apiResponse?.content.orderNumber}
              </span>
              <span className="quote-actions">
                {getDictionaryValueOrKey(config?.labels?.detailsActions)}
              </span>
              {/* <GridHeader data={data} gridProps={gridProps} /> */}
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
            <ContactCard
              soldTo={apiResponse?.content?.shipTo || {}}
              config={config}
            />
          </div>
        </div>
        <div className="cmp-orders-qp__grid">
          <div className="details-container">
            <span className="details-preview">
              Line Item Details
              {/* {componentProp?.productLines?.lineItemDetailsLabel || 'Details'} */}
            </span>
          </div>
          {apiResponse &&
            <OrdersTrackingDetailGrid data={apiResponse.content} gridProps={config} />
          }
        </div>
      </section>
    </div>
  );
}

export default OrdersTrackingDetail;
