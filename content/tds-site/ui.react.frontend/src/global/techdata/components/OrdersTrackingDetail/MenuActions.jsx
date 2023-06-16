import React from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';

const MenuActions = ({
  hasAIORights,
  hasOrderModificationRights,
  items = [],
  labels,
  modifyOrder,
}) => {
  const areDeliveryNotesAvailable = items.some(
    (item) => item.deliveryNotes.length > 0
  );

  const areInvoicesAvailable = items.some((item) => item.invoices.length > 0);

  const areSerialNumbersAvailable = items.some((item) => item.serialNumber);

  return (
    <ul>
      {areDeliveryNotesAvailable && (
        <li>{getDictionaryValueOrKey(labels?.detailsActionViewDNotes)}</li>
      )}
      {hasAIORights && areInvoicesAvailable && (
        <li>{getDictionaryValueOrKey(labels?.detailsActionViewInvoices)}</li>
      )}
      {hasOrderModificationRights && (
        <li onClick={modifyOrder}>
          {getDictionaryValueOrKey(labels?.detailsActionModifyOrder)}
        </li>
      )}
      {areSerialNumbersAvailable && (
        <li>
          {getDictionaryValueOrKey(labels?.detailsActionExportSerialNumbers)}
        </li>
      )}
    </ul>
  );
};
export default MenuActions;
