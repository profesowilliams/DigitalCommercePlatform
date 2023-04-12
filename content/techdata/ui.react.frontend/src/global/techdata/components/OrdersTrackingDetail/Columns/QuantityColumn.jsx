import React from 'react'

function QuantityColumn({line}) {
  return (
    <div className="cmp-order-tracking-grid__quantity-column">{`${line?.quantity}`}</div>
  );
}

export default QuantityColumn