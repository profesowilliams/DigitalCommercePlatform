import React, { useState } from 'react';
import {
  ParcelIcon,
  WarningModifiedIcon,
  ProhibitedIcon,
  CompletedIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const StatusColumn = ({ data, iconsStatuses }) => {
  const { status, shipComplete } = data || {};

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

  return data && data?.statusText ? (
    <div className="status-column-container">
      <Tooltip
        title={renderTooltip()}
        placement="bottom"
        arrow
        disableHoverListener={enableTooltip ? false : true}
        disableInteractive={true}
      >
        <span className="status-span-icon">{renderIcon()}</span>
      </Tooltip>

      <span className={noIcon ? 'status-icon-offset' : ''}>
        {data?.statusText}
      </span>
    </div>
  ) : (
    <span>-</span>
  );
};
export default StatusColumn;
