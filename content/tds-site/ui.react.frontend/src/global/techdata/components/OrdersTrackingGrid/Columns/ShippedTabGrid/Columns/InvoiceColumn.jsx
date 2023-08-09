import React from 'react';
function InvoiceColumn({ line, id, openFilePdf, hasAIORights }) {
  const handleDownload = () => {
    hasAIORights && openFilePdf('Invoice', id, line?.invoices[0]?.id);
  };
  return (
    <div
      className="order-line-details__content__downloadLink"
      onClick={handleDownload}
    >
      {line?.invoices[0]?.id || '-'}
    </div>
  );
}
export default InvoiceColumn;
