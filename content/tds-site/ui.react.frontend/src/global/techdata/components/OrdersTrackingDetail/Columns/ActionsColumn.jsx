import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import ActionButton from './ActionButton';

const ActionsColumn = ({
  line,
  config = {},
  openFilePdf,
  apiResponse,
  hasAIORights,
  sortedLineDetails,
}) => {
  const effects = useOrderTrackingStore((st) => st.effects);
  const labels = config?.actionLabels;
  const areDeliveryNotesAvailable = line.deliveryNotes.length > 0;
  const areInvoicesAvailable = line.invoices.length > 0;
  const isSerialNumberAvailable = line.serials.length > 0;
  const id = apiResponse?.orderNumber;

  let invoices = [];
  invoices = line.invoices;
  let deliveryNotes = [];
  deliveryNotes = line.deliveryNotes;
  const toaster = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      config?.actionLabels?.toasterCopySerialNumbersMessage
    ),
  };
  const handleDownloadDnote = () => {
    openFilePdf('DNote', id, deliveryNotes[0]?.id);
  };
  const handleDownloadInvoice = () => {
    openFilePdf('Invoice', id, invoices[0]?.id);
  };

  const handleCopySerialNumbers = () => {
    const lineSerials = line?.serials || [];
    const serialsText = lineSerials.join('\n');
    navigator.clipboard.writeText(serialsText);

    effects.setCustomState({ key: 'toaster', value: { ...toaster } });
  };

  const menuActionsItems = [
    {
      condition: true,
      label: labels?.track,
      onClick: null,
    },
    {
      condition: areDeliveryNotesAvailable,
      label: labels?.viewDNotes,
      onClick: handleDownloadDnote,
    },
    {
      condition: hasAIORights && areInvoicesAvailable,
      label: labels?.viewInvoices,
      onClick: handleDownloadInvoice,
    },
    {
      condition: isSerialNumberAvailable,
      label: labels?.copySerialNumber,
      onClick: handleCopySerialNumbers,
    },
  ];

  return (
    <div className="cmp-order-tracking-grid-details__splitLine-column">
      {sortedLineDetails(line)?.map((el, index) => (
        <ActionButton
          key={el.id}
          line={line}
          element={el}
          index={index}
          menuActionsItems={menuActionsItems}
        />
      ))}
    </div>
  );
};

export default ActionsColumn;
