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
  const className = open ? 'status-popover-grid' : undefined;
  const icon = data?.shipComplete ? (
    <span className="status-span-icon" onClick={handleClick}>
      <ParcelIcon />
    </span>
  ) : (
    ''
  );
  return data && data?.status ? (
    <span>
      {icon}
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

      {data?.status}
    </span>
  ) : (
    <span>-</span>
  );
};
export default StatusColumn;
