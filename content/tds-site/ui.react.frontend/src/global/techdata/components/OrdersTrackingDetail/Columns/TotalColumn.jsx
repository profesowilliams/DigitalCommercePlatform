import React from 'react'

function TotalColumn({ line }) {
  return (
    <div className="cmp-order-tracking-grid__total-column">{`${line?.totalPriceFormatted}`}</div>
  );
}

export default TotalColumn