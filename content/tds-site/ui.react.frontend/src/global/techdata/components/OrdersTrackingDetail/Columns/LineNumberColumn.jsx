import React from 'react'

function LineNumberColumn({ line }) {
  return (
    <div className="cmp-order-tracking-grid-details__line">{`${line?.line}`}</div>
  );
}

export default LineNumberColumn