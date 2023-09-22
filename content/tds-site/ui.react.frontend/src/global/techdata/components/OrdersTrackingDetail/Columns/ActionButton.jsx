import React, { useState } from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';
import MenuActions from '../Header/MenuActions';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const ActionsButton = ({
  line,
  element,
  index,
  config = {},
  openFilePdf,
  apiResponse,
  hasAIORights,
}) => {
  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const multiple = line?.lineDetails?.length > 1;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;
  const isSingleElement = !multiple;

  const isShipment = element?.isShipment === true;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };
  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };
  const effects = useOrderTrackingStore((st) => st.effects);
  const { setCustomState } = effects;
  const labels = config?.actionLabels;
  const areDeliveryNotesAvailable = line.deliveryNotes.length > 0;
  const areInvoicesAvailable = line.invoices.length > 0;
  const isSerialNumberAvailable = line.serials.length > 0;
  const id = apiResponse?.orderNumber;
  const poNumber = apiResponse?.customerPO;

  const invoices = line.invoices;
  const deliveryNotes = line.deliveryNotes;
  const toaster = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      config?.actionLabels?.toasterCopySerialNumbersMessage
    ),
  };
  const hasMultipleDNotes = deliveryNotes.length > 1;
  const hasMultipleInvoices = invoices.length > 1;
  const handleDownloadDnote = () => {
    openFilePdf('DNote', id, deliveryNotes[0]?.Id);
  };
  const handleDownloadInvoice = () => {
    openFilePdf('Invoice', id, invoices[0]?.Id);
  };
  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: { data: deliveryNotes, show: true, id, reseller: poNumber },
    });
  };
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id, reseller: poNumber },
    });
  };
  const handleCopySerialNumbers = () => {
    const serialsString = line?.serials || '';
    const lineSerials = serialsString.split(',').map((serial) => serial.trim());
    if (Array.isArray(lineSerials)) {
      const serialsText = lineSerials.join('\n');
      serialsText && navigator.clipboard.writeText(serialsText);
    }

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
      onClick: hasMultipleDNotes ? triggerDNotesFlyout : handleDownloadDnote,
    },
    {
      condition: hasAIORights && areInvoicesAvailable,
      label: labels?.viewInvoices,
      onClick: hasMultipleInvoices
        ? triggerInvoicesFlyout
        : handleDownloadInvoice,
    },
    {
      condition: isSerialNumberAvailable,
      label: labels?.copySerialNumber,
      onClick: handleCopySerialNumbers,
    },
  ];

  return (
    <div
      className={`cmp-order-tracking-grid-details__splitLine${
        isSingleElement || isLastElement
          ? '__separateLine'
          : '__separateLineMultiple'
      } cmp-order-tracking-grid-details__splitLine--centerAlignActionButton actions-container`}
      onMouseOver={handleActionMouseOver}
      onMouseLeave={handleActionMouseLeave}
    >
      <EllipsisIcon
        className="cmp-order-tracking-grid-details__splitLine__separateLineText"
        style={iconStyle}
      />
      {actionsDropdownVisible && isShipment && (
        <div
          className="actions-dropdown"
          onMouseOver={handleActionMouseOver}
          onMouseLeave={handleActionMouseLeave}
        >
          <MenuActions items={menuActionsItems} />
        </div>
      )}
    </div>
  );
};

export default ActionsButton;
