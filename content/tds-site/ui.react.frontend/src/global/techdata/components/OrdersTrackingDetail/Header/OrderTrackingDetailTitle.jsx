import React, { useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getOrderDetailsAnalyticsGoogle, pushDataLayerGoogle } from '../../OrdersTrackingGrid/utils/analyticsUtils';

const OrderTrackingDetailTitle = ({ content, labels }) => {
  const { statusText, orderNumber, shipComplete } = content;
  const { orderNo, completeDeliveryOnly } = labels;
  const completeDeliveryOnlyAvailable = shipComplete === true;

  useEffect(() => {
    pushDataLayerGoogle(
      getOrderDetailsAnalyticsGoogle(
        content?.orderNumber,
        content?.created
      )
    );
  }, []);

  return (
    <div className="quote-preview-title">
      <span className="quote-preview-bold">
        {`${getDictionaryValueOrKey(orderNo)}: `}
      </span>
      <span className="quote-preview">{orderNumber}</span>
      <span className="quote-preview-bold quote-preview-offset">|</span>
      <span className="quote-preview-bold quote-preview-offset">
        {statusText}
      </span>
      {completeDeliveryOnlyAvailable && (
        <span className="quote-preview">
          {` ${getDictionaryValueOrKey(completeDeliveryOnly)}`}
        </span>
      )}
    </div>
  );
};
export default OrderTrackingDetailTitle;
