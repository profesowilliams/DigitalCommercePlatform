import React from 'react';
function ItemColumn({ line, config }) {
  return (
    <div className="order-line-details__content__description-column">
      <div>Img</div>
      <div className="order-line-details__content__description-right">
        description
      </div>
    </div>
  );
}
export default ItemColumn;
