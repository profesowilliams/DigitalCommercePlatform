import React from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';

function OrderTrackingActionColumn() {

  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  return <EllipsisIcon style={iconStyle} />;
}

export default OrderTrackingActionColumn;
