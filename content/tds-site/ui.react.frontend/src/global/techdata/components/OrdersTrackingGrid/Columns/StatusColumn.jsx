import React from 'react';
import {
  ParcelIcon,
  WarningModifiedIcon,
  ProhibitedIcon,
  CompletedIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Tooltip from '@mui/material/Tooltip';

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
          : '';
      default:
        return '';
    }
  };

  const enableTooltip =
    ['Investigation', 'Rejected', 'Completed'].includes(status) ||
    (status === 'Open' && shipComplete);

  const text =
    data?.statusText && data.statusText.length > 18
      ? data.statusText.slice(0, 18) + '...'
      : data.statusText;

  return data && data?.statusText ? (
    <div className="status-column-container">
      <Tooltip
        title={renderTooltip()}
        placement="top"
        arrow
        disableHoverListener={enableTooltip ? false : true}
        disableInteractive={true}
      >
        <span className="status-span-icon">{renderIcon()}</span>
      </Tooltip>
      <Tooltip
        title={data?.statusText}
        placement="top"
        arrow
        disableInteractive={true}
      >
        <span className="status-column-container__text">{text}</span>
      </Tooltip>
    </div>
  ) : (
    <span>-</span>
  );
};
export default StatusColumn;
