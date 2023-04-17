import React from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';

function ActionsColumn() {

  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  return (
    <div className="cmp-order-tracking-grid-details__action-column">
      <EllipsisIcon style={iconStyle} />
    </div>
  );
}

export default ActionsColumn;
