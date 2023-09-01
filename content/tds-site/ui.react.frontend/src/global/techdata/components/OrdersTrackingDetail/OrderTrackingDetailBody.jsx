import React from 'react';
import OrderTrackingContainer from './Body/OrderTrackingContainer';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';

const OrderTrackingDetailBody = ({
  config,
  apiResponse,
  openFilePdf,
  hasAIORights,
  gridRef,
  rowToGrayOutTDNameRef,
}) => {
  return (
    <div className="cmp-orders-qp__grid cmp-order-preview">
      <OrderTrackingContainer config={config} />
      {apiResponse && (
        <OrdersTrackingDetailGrid
          data={apiResponse.content}
          gridProps={config}
          openFilePdf={openFilePdf}
          hasAIORights={hasAIORights}
          gridRef={gridRef}
          rowToGrayOutTDNameRef={rowToGrayOutTDNameRef}
        />
      )}
    </div>
  );
};
export default OrderTrackingDetailBody;
