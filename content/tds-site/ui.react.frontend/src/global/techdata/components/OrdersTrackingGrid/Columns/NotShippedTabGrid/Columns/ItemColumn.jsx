import React from 'react';
import Tooltip from '@mui/material/Tooltip';

function ItemColumn({ line }) {
  return (
    <div className="order-line-details__content__innerTableNotShipped__item-row">
      <img
        className={'order-line-details__content__innerTableNotShipped__image'}
        src={line?.urlProductImage}
        alt=""
      />
      <Tooltip
        title={line?.displayName ?? ''}
        placement="top"
        arrow
        disableInteractive={true}
      >
        <div className="order-line-details__content__innerTableNotShipped__right">
          <span className="order-line-details__content__innerTableNotShipped__ellipsis">
            {line?.displayName}
          </span>
        </div>
      </Tooltip>
    </div>
  );
}
export default ItemColumn;
