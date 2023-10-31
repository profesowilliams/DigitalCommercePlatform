import React, { useState } from 'react';
import { ParcelIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { Popover } from '@mui/material';

const StatusColumn = ({ data, completeDeliveryOnly }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const className = open ? 'status-popover-grid' : '';
  const icon = data?.shipComplete ? (
    <span className="status-span-icon" onClick={handleClick}>
      <ParcelIcon />
    </span>
  ) : null;
  return data && data?.status ? (
    <div>
      <span>{icon}</span>
      <span className={!data?.shipComplete ? 'status-icon-offset' : ''}>
        {data?.status}
      </span>
      <Popover
        className={className}
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
