import React from 'react';
import QuantityAndDeliveryEstimateLine from './QuantityAndDeliveryEstimateLine';

function QuantityAndDeliveryEstimateColumn({
  line,
  config,
  id,
  isSeeOptionsButtonVisible,
}) {
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-column">
      {line?.lineDetails?.map((el, index) => (
        <QuantityAndDeliveryEstimateLine
          line={line}
          el={el}
          index={index}
          key={index}
          config={config}
          id={id}
          isSeeOptionsButtonVisible={isSeeOptionsButtonVisible}
        />
      ))}
    </div>
  );
}
export default QuantityAndDeliveryEstimateColumn;
