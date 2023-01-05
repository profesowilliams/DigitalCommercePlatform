import React from 'react';

function InvoiceColumn({ invoices = [] }) {
  const hasMultiple = invoices.length > 1;
  return (
    <a>
      {invoices.length ? (hasMultiple ? 'multiple' : invoices[0]?.id) : null}
    </a>
  );
}

export default InvoiceColumn;
