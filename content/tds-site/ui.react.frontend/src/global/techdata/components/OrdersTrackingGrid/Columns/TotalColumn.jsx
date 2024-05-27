import React from 'react'

function TotalColumn({ data }) {
  const lastDataSource = data?.lastDataSource;
  const priceLoading = lastDataSource === 'OrderModification';
  return (
    <div className="cmp-order-tracking-grid__total-column">
      {!priceLoading ? `${data?.priceFormatted}` : '-'}
    </div>
  );
}

export default TotalColumn