import React from 'react';
import QuantityAndDeliveryEstimateLine from './QuantityAndDeliveryEstimateLine';

/**
 * QuantityAndDeliveryEstimateColumn component renders a column displaying
 * quantity and delivery estimate details for each line item. It maps over 
 * the line details and renders a `QuantityAndDeliveryEstimateLine` for each item.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.line - The line item data, including details and quantities.
 * @param {Object} props.config - The configuration object with necessary URLs and settings.
 * @param {string} props.id - The order ID.
 * @param {boolean} props.isSeeOptionsButtonVisible - Flag to determine if the "See Options" button should be visible.
 * @returns {JSX.Element} The rendered column of quantity and delivery estimate details.
 */
function QuantityAndDeliveryEstimateColumn({ line, config, id, isSeeOptionsButtonVisible }) {
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