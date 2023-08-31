import React from 'react'

function LineNumberColumn({ data }) {
  return (
    <div className="cmp-order-tracking-grid__id-column">{`${data?.line}`}</div>
  );
}

export default LineNumberColumn