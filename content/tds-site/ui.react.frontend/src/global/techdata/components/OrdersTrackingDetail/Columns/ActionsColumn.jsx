import React, { useState } from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';
import MenuActions from '../Header/MenuActions';

const ActionsColumn = ({
  line,
  config = {},
  openFilePdf,
  apiResponse,
  hasAIORights,
}) => {
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);

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

  const labels = config?.labels;

  const areDeliveryNotesAvailable = line.deliveryNotes.length > 0;
  const areInvoicesAvailable = line.invoices.length > 0;
  const isSerialNumberAvailable = Boolean(line.serialNumber);
  const id = apiResponse?.orderNumber;
  let invoices = [];
  invoices = line.invoices;
  let deliveryNotes = [];
  deliveryNotes = line.deliveryNotes;

  const handleDownloadDnote = () => {
    openFilePdf('DNote', id, deliveryNotes[0]?.id);
  };
  const handleDownloadInvoice = () => {
    openFilePdf('Invoice', id, invoices[0]?.id);
  };

  const menuActionsItems = [
    {
      condition: true,
      label: labels?.detailsActionTrack,
      onClick: null,
    },
    {
      condition: areDeliveryNotesAvailable,
      label: labels?.detailsActionViewDNotes,
      onClick: handleDownloadDnote,
    },
    {
      condition: hasAIORights && areInvoicesAvailable,
      label: labels?.detailsActionViewInvoices,
      onClick: handleDownloadInvoice,
    },
    {
      condition: isSerialNumberAvailable,
      label: labels?.detailsActionCopySerialNumber,
      onClick: null,
    },
  ];

  return (
    <div
      className="cmp-order-tracking-grid-details__action-column actions-container"
      onMouseOver={handleActionMouseOver}
      onMouseLeave={handleActionMouseLeave}
    >
      <EllipsisIcon style={iconStyle} />
      {actionsDropdownVisible && (
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
