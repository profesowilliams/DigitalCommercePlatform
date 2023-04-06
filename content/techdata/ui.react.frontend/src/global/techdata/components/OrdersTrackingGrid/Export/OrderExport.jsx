import React from 'react'
import { ArrowExitIcon } from '../../../../../fluentIcons/FluentIcons'
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
  return (
    <div onClick={triggerInvoicesFlyout} className='cmp-order-tracking-grid__export'>
        <ArrowExitIcon className="icon-hover"/>
    </div>

  )
}

export default OrderExport
