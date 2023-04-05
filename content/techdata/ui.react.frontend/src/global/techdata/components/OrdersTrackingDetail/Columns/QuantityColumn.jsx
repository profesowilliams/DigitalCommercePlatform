import React from 'react'

function QuantityColumn({data}) {
  return (
    <div className="cmp-order-tracking-grid__quantity-column">{`${data?.quantity}`}</div>
  );
}

export default QuantityColumn