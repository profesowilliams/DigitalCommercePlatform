import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  getInvoiceViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';

function InvoiceColumn({
  invoices = [],
  multiple,
  id,
  reseller,
  openFilePdf
}) {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const hasMultiple = invoices?.length > 1;

  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: {
        data: null,
        show: true,
        id: id,
        reseller: reseller ? reseller : '-',
      },
    });
    pushDataLayerGoogle(
      getInvoiceViewAnalyticsGoogle(invoices?.length, 'Main Grid')
    );
  };

  const handleDownload = () => {
    openFilePdf('Invoice', id, invoices[0].id);
    pushDataLayerGoogle(getInvoiceViewAnalyticsGoogle(1, 'Main Grid'));
  };

  return invoices?.length === 0 ? ('-') : 
  (
    !invoices[0].canDownloadDocument 
      ? invoices[0].id
      : (<div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
         <a>{hasMultiple ? getDictionaryValueOrKey(multiple) : invoices[0].id}</a>
         </div>)
  );
}

export default InvoiceColumn;
