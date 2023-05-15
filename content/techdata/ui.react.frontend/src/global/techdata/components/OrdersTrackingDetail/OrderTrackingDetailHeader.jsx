import React from 'react';
import Link from './../Widgets/Link';
import { getDictionaryValueOrKey } from './../../../../utils/utils';

const OrderTrackingDetailHeader = ({ config, apiResponse }) => {
  return (
    <div className="header-container">
      <div className="image-container">
        <Link
          variant="back-to-orders"
          href={config?.ordersUrl || '#'}
          underline="underline-none"
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
            {apiResponse?.content?.orderNumber &&
              ` | ${getDictionaryValueOrKey(config.labels?.detailsOrderNo)}: `}
          </span>
          <span className="quote-preview">
            {apiResponse?.content?.orderNumber}
          </span>
        </div>
        <span className="quote-actions"></span>
      </div>
    </div>
  );
};
export default OrderTrackingDetailHeader;
