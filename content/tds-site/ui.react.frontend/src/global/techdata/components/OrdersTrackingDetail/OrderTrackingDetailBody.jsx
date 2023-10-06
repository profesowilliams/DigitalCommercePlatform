import React, { useEffect } from 'react';
import OrderTrackingContainer from './Body/OrderTrackingContainer';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';

const OrderTrackingDetailBody = ({
  config,
  content,
  openFilePdf,
  hasAIORights,
  gridRef,
  rowsToGrayOutTDNameRef,
  newItem,
}) => {
  useEffect(() => {
    if (newItem) {
      const itemsCopy = [...content.items];
      itemsCopy.unshift({
        key: '23123',
        line: '',
        urlProductImage: newItem.images.default.url,
        displayName: newItem.description,
        mfrNumber: newItem.manufacturerPartNumber,
        unitCost: newItem.price.bestPrice,
        unitPriceCurrency: newItem.price.currency,
        lineTotal: newItem.price.bestPrice,
      });
      gridRef.current?.api.setRowData(itemsCopy);
    }
  }, [newItem]);

  return (
    <div className="cmp-orders-qp__grid cmp-order-preview">
      <OrderTrackingContainer config={config} />
      <OrdersTrackingDetailGrid
        data={content}
        gridProps={config}
        openFilePdf={openFilePdf}
        hasAIORights={hasAIORights}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
      />
    </div>
  );
};
export default OrderTrackingDetailBody;
