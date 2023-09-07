import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import { useOrderTrackingStore } from '../../../store/OrderTrackingStore';
function InvoiceColumn({
  line,
  config,
  id,
  openFilePdf,
  hasAIORights,
  reseller,
}) {
  const hasMultiple = line?.invoices?.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: {
        data: line?.invoices,
        show: true,
        id: id ?? '-',
        reseller: reseller ?? '-',
      },
    });
  };

  const handleDownload = () => {
    hasAIORights && openFilePdf('Invoice', id, line?.invoices);
  };
  return line?.invoices?.length == 0 ? (
    '-'
  ) : (
    <div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
      <a>
        {hasMultiple
          ? getDictionaryValueOrKey(config?.multiple)
          : line?.invoices
          ? line?.invoices[0]?.id
          : '-'}
      </a>
    </div>
  );
}
export default InvoiceColumn;
