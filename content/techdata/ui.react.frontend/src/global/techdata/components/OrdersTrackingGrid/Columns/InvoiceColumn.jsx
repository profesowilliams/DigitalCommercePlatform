import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';


function InvoiceColumn({ invoices = [], multiple, id, reseller }) {
  const hasMultiple = invoices.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id: id, reseller: reseller },
    });
  };
  return invoices.length == 0 ? (
    '-'
  ) : (
    <div onClick={hasMultiple ? triggerInvoicesFlyout : null}>
      <a>{hasMultiple ? getDictionaryValueOrKey(multiple) : invoices[0]?.id}</a>
    </div>
  );
}

export default InvoiceColumn;
