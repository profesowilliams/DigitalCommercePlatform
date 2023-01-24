import React from 'react';

function OrderNoColumn({ id, detailUrl }) {
  return (
    detailUrl ? 
      <a href={`${detailUrl}?id=${id}`}>
        {id}
      </a> : <span>{id}</span>
  );
}

export default OrderNoColumn;
