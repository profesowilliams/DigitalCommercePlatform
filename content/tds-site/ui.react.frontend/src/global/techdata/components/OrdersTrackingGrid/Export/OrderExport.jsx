import React, {useState} from 'react'
import { ArrowExitIcon, ArrowExitIconFilled } from '../../../../../fluentIcons/FluentIcons'
import "../../../../../../src/styles/TopIconsBar.scss"
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function OrderExport({ gridConfig }) {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'exportFlyout',
      value: { show: true },
    });
  };
  const [isExportHovered, setIsExportHovered] = useState(false);
  const handleMouseOverSearch = () => {
    setIsExportHovered(true);
  };
  const handleMouseLeaveSearch = () => {
    setIsExportHovered(false);
  };
  return (
    <Tooltip
      title={getDictionaryValueOrKey(gridConfig?.exportTooltip)}
      placement="top"
      arrow
      disableInteractive={true}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14],
              },
            },
          ],
        },
      }}
    >
      <div
        className="cmp-order-tracking-grid__export"
        onClick={triggerInvoicesFlyout}
        onMouseOver={handleMouseOverSearch}
        onMouseLeave={handleMouseLeaveSearch}
      >
        {isExportHovered ? (
          <ArrowExitIconFilled className="icon-hover" />
        ) : (
          <ArrowExitIcon className="icon-hover" />
        )}
      </div>
    </Tooltip>
  );
}

export default OrderExport
