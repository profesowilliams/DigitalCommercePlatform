import React, { useState, useEffect } from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';
import MenuActions from '../Header/MenuActions';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

// TODO: map over multiple lines from lineDetails
const ActionsColumn = ({
  line,
  config = {},
  openFilePdf,
  apiResponse,
  hasAIORights,
}) => {
  const effects = useOrderTrackingStore((st) => st.effects);

  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [actionButtonVisible, setActionButtonVisible] = useState(true);

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };
  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };

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
  useEffect(() => {
    if (line?.lineDetails[0]?.quantity === 0) {
      return setActionButtonVisible(false);
    } else {
      return setActionButtonVisible(true);
    }
  }, [line?.lineDetails[0]?.quantity]);
  return (
    <div
      className="cmp-order-tracking-grid-details__action-column actions-container"
      onMouseOver={handleActionMouseOver}
      onMouseLeave={handleActionMouseLeave}
    >
      {actionButtonVisible && <EllipsisIcon style={iconStyle} />}
      {actionButtonVisible && actionsDropdownVisible && (
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

export default ActionsColumn;
