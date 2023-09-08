import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';

function LineStatusColumn({ line }) {
  const status = line.lineDetails?.[0]?.statusText;
  const isEOL = line.isEOL;
  const statusText = isEOL ? 'See options' : status;
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;

  const handleSeeOptionsClick = () => {
    setCustomState({
      key: 'productReplacementFlyout',
      value: { data: { line }, show: true },
    });
  };
  return <div onClick={isEOL && handleSeeOptionsClick}>{statusText ?? ''}</div>;
}

export default LineStatusColumn;
