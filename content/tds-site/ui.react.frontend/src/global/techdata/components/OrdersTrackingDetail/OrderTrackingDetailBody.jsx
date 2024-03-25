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
    if (newItem && content && content.items) {
      const itemsCopy = [...content.items];
      const newLineDetails = content.items[0].lineDetails;
      newLineDetails[0] = { ...newLineDetails[0], statusText: 'New' };
      itemsCopy.unshift({
        ...content.items[0],
        tdNumber: '',
        key: Math.random(),
        line: '10',
        urlProductImage: newItem.images.default.url,
        displayName: newItem.description,
        mfrNumber: newItem.manufacturerPartNumber,
        unitCost: newItem.price.bestPrice,
        unitPriceCurrency: newItem.price.currency,
        lineTotal: newItem.price.bestPrice,
        isEOL: false,
      });
      gridRef.current?.api.setRowData(itemsCopy);
    }
  }, [newItem]);

  return (
    <div className="cmp-orders-qp__grid cmp-order-preview">
      <OrderTrackingContainer config={config} />
      <OrdersTrackingDetailGrid
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
