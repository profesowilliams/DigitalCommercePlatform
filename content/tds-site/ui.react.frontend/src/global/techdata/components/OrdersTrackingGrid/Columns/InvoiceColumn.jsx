import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  getInvoiceViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';

function InvoiceColumn({ invoices = [], multiple, id, reseller, openFilePdf }) {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const hasMultiple = invoices?.length > 1;
  const firstInvoice = invoices ? invoices[0] : [];
  const isInvoiceDownloadable = firstInvoice?.canDownloadDocument;
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
    if (isInvoiceDownloadable) {
      openFilePdf('Invoice', id, firstInvoice?.id);
      pushDataLayerGoogle(getInvoiceViewAnalyticsGoogle(1, 'Main Grid'));
    }
  };

  const renderContent = () => {
    return !isInvoiceDownloadable ? (
      firstInvoice?.id
    ) : (
      <div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
        <a>
          {hasMultiple ? getDictionaryValueOrKey(multiple) : firstInvoice?.id}
        </a>
      </div>
    );
  };

  return invoices?.length === 0 ? '-' : renderContent();
}

export default InvoiceColumn;
