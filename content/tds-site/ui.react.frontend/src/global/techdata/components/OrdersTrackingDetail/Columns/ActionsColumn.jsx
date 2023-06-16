import React, { useState } from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';
import MenuActions from '../MenuActions';

const ActionsColumn = ({ line, config = {} }) => {
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

  const areInvoicesAvailable = line.invoices.length > 0;
  const isSerialNumberAvailable = Boolean(line.serialNumber);

  const menuActionsItems = [
    {
      condition: true,
      label: labels?.detailsActionTrack,
      onClick: null,
    },
    {
      condition: true,
      label: labels?.detailsActionViewDNotes,
      onClick: null,
    },
    {
      condition: areInvoicesAvailable,
      label: labels?.detailsActionViewInvoices,
      onClick: null,
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
          <MenuActions
            hasAIORights={true}
            hasOrderModificationRights={true}
            items={menuActionsItems}
          />
        </div>
      )}
    </div>
  );
};

export default ActionsColumn;
