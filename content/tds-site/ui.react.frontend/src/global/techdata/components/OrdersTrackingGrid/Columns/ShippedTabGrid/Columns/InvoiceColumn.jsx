import React from 'react';
import { useOrderTrackingStore } from '../../../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * Component that renders invoice information in a specific column.
 * Depending on the data, it either displays the invoice ID or provides a link to download the invoice PDF.
 * If there are multiple invoices, a flyout is triggered to show all invoices.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.line - The data for the current line item.
 * @param {string} props.id - The unique ID of the line item.
 * @param {Function} props.openFilePdf - Function to handle opening the invoice PDF.
 * @param {string} props.reseller - The name or ID of the reseller.
 * @returns {JSX.Element} The rendered component.
 */
function InvoiceColumn({ line, id, openFilePdf, reseller }) {
  // Fetch translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Expand.ShippedTab'];
  const errorMessagesTranslations = uiTranslations?.['OrderTracking.Common.ErrorMessages'];

  // Determine if there are multiple invoices and if the first invoice is downloadable
  const hasMultiple = line?.invoices?.length > 1;
  const firstInvoice = line?.invoices ? line?.invoices[0] : [];
  const isInvoiceDownloadable = firstInvoice?.canDownloadDocument;

  // Effect to set custom state for the order tracking store
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);

  /**
   * Triggers the flyout to display all invoices.
   */
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

  /**
   * Handles the download of the invoice PDF.
   * Uses the `openFilePdf` function to open the PDF.
   */
  const handleDownload = () => {
    if (isInvoiceDownloadable) {
      openFilePdf(errorMessagesTranslations, 'Invoice', id, firstInvoice?.id);
    }
  };

  /**
   * Renders the content for the invoice column.
   * If the invoice is not downloadable, it shows the invoice ID.
   * Otherwise, it renders a clickable link to either download the invoice or trigger the flyout.
   * 
   * @returns {JSX.Element} The content to render.
   */
  const renderContent = () => {
    return !isInvoiceDownloadable ? (
      firstInvoice?.id
    ) : (
      <div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
        <a>
          {hasMultiple
            ? translations?.Multiple || 'multiple'
            : firstInvoice?.id}
        </a>
      </div>
    );
  };

  // Return '-' if there are no invoices, otherwise render the content
  return line?.invoices?.length == 0 ? '-' : renderContent();
}

export default InvoiceColumn;