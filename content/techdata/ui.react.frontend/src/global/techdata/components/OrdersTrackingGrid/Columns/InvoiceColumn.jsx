import React from 'react';

const getInvoiceStatus = (invoices) => {
  if (!invoices) return '-';
  const invoiceLength = invoices.length;

  if (invoiceLength === 1) {
    return invoices[0]?.id;
  }

  if (invoiceLength > 1) {
    return 'multiple';
  }

  return '-';
}

function InvoiceColumn({ invoices = [] }) {
  return (
    <a>
      {getInvoiceStatus(invoices)}
    </a>
  );
}

export default InvoiceColumn;
