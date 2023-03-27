import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';


const getInvoiceStatus = (invoices, multiple) => {

  if (!invoices) return '-';
  const invoiceLength = invoices.length;

  if (invoiceLength === 1) {
    return invoices[0]?.id;
  }

  if (invoiceLength > 1) {
    return getDictionaryValueOrKey(
      multiple
    );
  }

  return '-';
}

function InvoiceColumn({ invoices = [] ,multiple, id}) {
  const hasMultiple = invoices.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id: id },
    });
  };
  return (
    <div onClick={hasMultiple ? triggerInvoicesFlyout : null}>
      <a>
        {getInvoiceStatus(invoices, multiple)}
      </a>
    </div>
  );
}

export default InvoiceColumn;
