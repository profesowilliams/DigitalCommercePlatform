import React from 'react'

function LineNumberColumn({ line }) {
  return (
    <div className="cmp-order-tracking-grid__id-column">{`${line?.line}`}</div>
  );
}

export default LineNumberColumn