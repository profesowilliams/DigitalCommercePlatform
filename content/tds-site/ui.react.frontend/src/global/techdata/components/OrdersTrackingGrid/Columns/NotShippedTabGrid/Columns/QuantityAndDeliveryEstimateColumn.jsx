import React from 'react';
import QuantityAndDeliveryEstimateLine from './QuantityAndDeliveryEstimateLine';

function QuantityAndDeliveryEstimateColumn({ line }) {
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-column">
      {line?.lineDetails?.map((el, index) => (
        <QuantityAndDeliveryEstimateLine
          line={line}
          el={el}
          index={index}
          key={index}
        />
      ))}
    </div>
  );
}
export default QuantityAndDeliveryEstimateColumn;
