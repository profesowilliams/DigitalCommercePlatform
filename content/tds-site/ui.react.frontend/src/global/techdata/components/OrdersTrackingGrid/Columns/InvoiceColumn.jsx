import React from 'react';
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
  openFilePdf,
  hasAIORights,
}) {
  const hasMultiple = invoices.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id: id, reseller: reseller?.id },
    });
    pushDataLayerGoogle(
      getInvoiceViewAnalyticsGoogle(invoices.length, 'Main Grid')
    );
  };
  const handleDownload = () => {
    hasAIORights && openFilePdf('Invoice', id, invoices[0]?.id);
  };
  return invoices.length == 0 ? (
    '-'
  ) : (
    <div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
      <a>{hasMultiple ? getDictionaryValueOrKey(multiple) : invoices[0]?.id}</a>
    </div>
  );
}

export default InvoiceColumn;
