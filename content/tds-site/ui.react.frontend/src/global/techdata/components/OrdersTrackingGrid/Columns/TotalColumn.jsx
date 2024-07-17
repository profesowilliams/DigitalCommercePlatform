import React from 'react'
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

function TotalColumn({ data }) {
  const lastDataSource = data?.lastDataSource;
  const priceLoading = lastDataSource === 'OrderModification';
  let totalCurrency = data?.currency;
  const userData = useOrderTrackingStore((state) => state.userData);
  if (!totalCurrency || totalCurrency === '') {
    totalCurrency = userData?.activeCustomer?.defaultCurrency ?? '';
  }
  return (
    <div className="cmp-order-tracking-grid__total-column">
      {!priceLoading ? `${data?.priceFormatted} ${totalCurrency}` : '-'}
    </div>
  );
}

export default TotalColumn