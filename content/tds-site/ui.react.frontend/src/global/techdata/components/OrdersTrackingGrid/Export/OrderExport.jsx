import React from 'react';
import {
  ArrowExitIcon,
  ArrowExitIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Hover from '../../Hover/Hover';

function OrderExport({ gridConfig }) {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'exportFlyout',
      value: { show: true },
    });
  };
  return (
    <Tooltip
      title={getDictionaryValueOrKey(gridConfig?.exportTooltip)}
      placement="top"
      arrow
      disableInteractive={true}
    >
      <div
        className="cmp-order-tracking-grid__export"
        onClick={triggerInvoicesFlyout}
      >
        <Hover onHover={<ArrowExitIconFilled className="icon-hover" />}>
          <ArrowExitIcon className="icon-hover" />
        </Hover>
      </div>
    </Tooltip>
  );
}

export default OrderExport;
