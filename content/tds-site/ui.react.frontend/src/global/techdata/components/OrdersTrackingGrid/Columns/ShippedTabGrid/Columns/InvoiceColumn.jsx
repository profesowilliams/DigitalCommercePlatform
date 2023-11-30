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
  const firstInvoice = line?.invoices ? line?.invoices[0] : [];
  const isInvoiceDownloadable = firstInvoice?.canDownloadDocument;
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
    if (isInvoiceDownloadable) {
      openFilePdf('Invoice', id, firstInvoice?.id);
    }
  };
  const renderContent = () => {
    return !isInvoiceDownloadable ? (
      firstInvoice?.id
    ) : (
      <div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
        <a>
          {hasMultiple
            ? getDictionaryValueOrKey(config?.multiple)
            : firstInvoice?.id}
        </a>
      </div>
    );
  };
  return line?.invoices?.length == 0 ? '-' : renderContent();
}
export default InvoiceColumn;
