import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const OrderTrackingContainer = ({ config }) => {
  return (
    <div className="details-container">
      <span className="details-preview">
        {getDictionaryValueOrKey(config?.labels?.detailsLineHeader)}
      </span>
    </div>
  );
};
export default OrderTrackingContainer;
