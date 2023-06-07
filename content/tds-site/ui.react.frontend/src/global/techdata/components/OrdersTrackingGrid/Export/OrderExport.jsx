import React, {useState} from 'react'
import { ArrowExitIcon, ArrowExitIconFilled } from '../../../../../fluentIcons/FluentIcons'
import "../../../../../../src/styles/TopIconsBar.scss"
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

function OrderExport() {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'exportFlyout',
      value: {show: true},
    });
  };
  const [isExportHovered, setIsExportHovered] = useState(false);
  const handleMouseOverSearch = () => {
    setIsExportHovered(true);
  }
  const handleMouseLeaveSearch = () => {
    setIsExportHovered(false);
  }
  return (
    <div className='cmp-order-tracking-grid__export' 
      onClick={triggerInvoicesFlyout} 
      onMouseOver={handleMouseOverSearch} 
      onMouseLeave={handleMouseLeaveSearch}
    >
        {isExportHovered ? <ArrowExitIconFilled className="icon-hover"/> 
        : <ArrowExitIcon className="icon-hover"/>}
    </div>
  )
}

export default OrderExport
