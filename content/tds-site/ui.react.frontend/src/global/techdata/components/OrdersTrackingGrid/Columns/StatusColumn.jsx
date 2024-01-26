import React, { useState } from 'react';
import {
  ParcelIcon,
  WarningModifiedIcon,
  ProhibitedIcon,
  CompletedIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { Popover } from '@mui/material';

const StatusColumn = ({ data, iconsStatuses }) => {
  const { status, shipComplete } = data || {};
  const [anchorEl, setAnchorEl] = useState(null);

  const showNewElement = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const renderIcon = () => {
    switch (status) {
      case 'Investigation':
        return <WarningModifiedIcon />;
      case 'Rejected':
        return <ProhibitedIcon />;
      case 'Completed':
        return <CompletedIcon />;
      case 'Open':
        return shipComplete ? <ParcelIcon /> : null;
      case 'Shipping':
        return null;
      default:
        return null;
    }
  };
  const renderTooltip = () => {
    switch (status) {
      case 'Investigation':
        return getDictionaryValueOrKey(iconsStatuses?.iconInvestigation);
      case 'Rejected':
        return getDictionaryValueOrKey(iconsStatuses?.rejected);
      case 'Completed':
        return getDictionaryValueOrKey(iconsStatuses?.completed);
      case 'Open':
        return shipComplete
          ? getDictionaryValueOrKey(iconsStatuses?.completeDeliveryOnly)
          : null;
      default:
        return null;
    }
  };

  const noIcon = renderIcon() === null;
  const enableTooltip =
    ['Investigation', 'Rejected', 'Completed'].includes(status) ||
    (status === 'Open' && shipComplete);

  const icon = (
    <span className="status-span-icon" onClick={showNewElement}>
      {renderIcon()}
    </span>
  );

  return data && data?.statusText ? (
    <div className="status-column-container" onMouseMoveCapture={handleClose}>
      <div onMouseOver={showNewElement}>{icon}</div>
      <span className={noIcon ? 'status-icon-offset' : ''}>
        {data?.statusText}
      </span>
      {enableTooltip && (
        <Popover
          className="status-popover-grid"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorPosition={{ top: 0, left: 700 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {renderTooltip()}
        </Popover>
      )}
    </div>
  ) : (
    <span>-</span>
  );
};
export default StatusColumn;
