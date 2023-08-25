import React from 'react';
function ItemColumn({ line }) {
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-row">
      <img
        className={'order-line-details__content__innerTableNotShipped__image'}
        src={line?.urlProductImage}
        alt=""
      />
      <div className="order-line-details__content__innerTableNotShipped__right">
        <span className="order-line-details__content__innerTableNotShipped__ellipsis">
          {line?.displayName}
        </span>
      </div>
    </div>
  );
}
export default ItemColumn;
