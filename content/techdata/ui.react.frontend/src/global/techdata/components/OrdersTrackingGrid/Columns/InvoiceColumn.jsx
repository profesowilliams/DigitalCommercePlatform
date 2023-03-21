import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';


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

function InvoiceColumn({ invoices = [] ,multiple}) {
  return (
    <a>
      {getInvoiceStatus(invoices, multiple)}
    </a>
  );
}

export default InvoiceColumn;
