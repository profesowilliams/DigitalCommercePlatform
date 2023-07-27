import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const OrderTrackingDetailTitle = ({ content, label }) => {
  const { status, orderNumber } = content;
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
