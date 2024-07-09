import React from 'react';
function PnSkuColumn({ line }) {
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-column">
      <span className="order-line-details__content__innerTableNotShipped__text">
        {line?.mfrNumber || ''}
      </span>
      <span className="order-line-details__content__innerTableNotShipped__text">
        {line?.tdNumber || ''}
      </span>
    </div>
  );
}
export default PnSkuColumn;
