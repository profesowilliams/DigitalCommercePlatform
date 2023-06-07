import React from 'react'

function StatusColumn({data}) {
  return (
    <div className="cmp-order-tracking-grid__status-column">{`${data?.status}`}</div>
  );
}

export default StatusColumn