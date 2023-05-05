import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';


function InvoiceColumn({ invoices = [], multiple, id, reseller, openFilePdf }) {
  const hasMultiple = invoices.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id: id, reseller: reseller },
    });
  };
  const handleDownload = () => {
    openFilePdf('Invoice', invoices[0]?.id);
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
