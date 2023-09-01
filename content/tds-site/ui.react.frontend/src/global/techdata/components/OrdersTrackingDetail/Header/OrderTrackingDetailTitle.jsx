import React, { useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  getOrderDetailsAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../../OrdersTrackingGrid/utils/analyticsUtils';

const OrderTrackingDetailTitle = ({ content, label }) => {
  const { status, orderNumber } = content;
  useEffect(() => {
    pushDataLayerGoogle(getOrderDetailsAnalyticsGoogle(orderNumber));
  }, []);

  return (
    <div>
      <span className="quote-preview-bold">{status}</span>
      <span className="quote-preview-bold">
        {` | ${getDictionaryValueOrKey(label)}: `}
      </span>
      <span className="quote-preview">{orderNumber}</span>
    </div>
  );
};
export default OrderTrackingDetailTitle;
