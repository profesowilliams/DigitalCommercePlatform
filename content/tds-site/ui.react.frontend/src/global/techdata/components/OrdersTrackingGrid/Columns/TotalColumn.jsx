import React from 'react'

function TotalColumn({ data }) {
  return (
    <div className="cmp-order-tracking-grid__total-column">{`${data?.priceFormatted}`}</div>
  );
}

export default TotalColumn