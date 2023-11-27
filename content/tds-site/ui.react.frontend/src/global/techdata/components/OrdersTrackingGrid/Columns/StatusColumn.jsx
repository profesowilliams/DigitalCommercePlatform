import React, { useState } from 'react';
import { ParcelIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { Popover } from '@mui/material';

const StatusColumn = ({ data, completeDeliveryOnly }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const showNewElement = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const icon = data?.shipComplete ? (
    <span className="status-span-icon" onClick={showNewElement}>
      <ParcelIcon />
    </span>
  ) : (
    <span className="status-span-icon-empty"></span>
  );
  return data && data?.status ? (
    <div onMouseMoveCapture={handleClose}>
      <span onMouseOver={showNewElement}>{icon}</span>
      <span className={!data?.shipComplete ? 'status-icon-offset' : ''}>
        {data?.status}
      </span>
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
        {getDictionaryValueOrKey(completeDeliveryOnly)}
      </Popover>
    </div>
  ) : (
    <span>-</span>
  );
};
export default StatusColumn;
