import React from 'react';
import { isJavaScriptProtocol } from '../../../../../utils/utils';

function OrderNoColumn({ id, detailUrl }) {
  return (
    detailUrl && !isJavaScriptProtocol.test(detailUrl) ? 
      <a href={`${detailUrl}.html?id=${id}`}>
        {id}
      </a> : <span>{id}</span>
  );
}

export default OrderNoColumn;
