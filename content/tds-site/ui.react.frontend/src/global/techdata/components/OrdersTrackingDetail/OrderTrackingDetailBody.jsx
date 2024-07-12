import React, { useEffect } from 'react';
import OrdersTrackingDetailGrid from './OrdersTrackingDetailGrid/OrdersTrackingDetailGrid';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

const OrderTrackingDetailBody = ({
  config,
  content,
  openFilePdf,
  gridRef,
  rowsToGrayOutTDNameRef,
  newItem,
  componentProps,
  isLoading
}) => {
  useEffect(() => {
    console.log('OrderTrackingDetailBody::useEffect::newItem');
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
      <div className="details-container">
        <span className="details-preview">
          {getDictionaryValueOrKey(config?.itemsLabels?.header)}
        </span>
      </div>
      <OrdersTrackingDetailGrid
        content={content}
        gridProps={config}
        openFilePdf={openFilePdf}
        gridRef={gridRef}
        componentProps={componentProps}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrderTrackingDetailBody;