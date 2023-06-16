import React from 'react';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';

const MenuActions = ({
  hasAIORights,
  hasOrderModificationRights,
  content,
  items = [],
  labels,
  openFilePdf,
  modifyOrder,
}) => {
  const areDeliveryNotesAvailable = items.some(
    (item) => item.deliveryNotes.length > 0
  );

  const areInvoicesAvailable = items.some((item) => item.invoices.length > 0);

  const areSerialNumbersAvailable = items.some((item) => item.serialNumber);

  let deliveryNotes = [];
  items.map((item) => {
    deliveryNotes = deliveryNotes.concat(item.deliveryNotes);
  });
  let invoices = [];
  items.map((item) => {
    invoices = invoices.concat(item.invoices);
  });
  const id = content?.orderNumber;
  const poNumber = content?.poNumber;
  const hasMultiple = deliveryNotes.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: { data: deliveryNotes, show: true, id: id, reseller: poNumber },
    });
  };

  //TODO: change to use Denotes after BE create mock request for downloading dnotes
  const handleDownload = () => {
    openFilePdf('Invoice', invoices[0]?.id);
  };

  return (
    <ul>
      {areDeliveryNotesAvailable && (
        <li onClick={hasMultiple ? triggerDNotesFlyout : handleDownload}>
          {getDictionaryValueOrKey(labels?.detailsActionViewDNotes)}
        </li>
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
