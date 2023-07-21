import React from 'react';
import { isJavaScriptProtocol } from '../../../../../utils/utils';
import { getOrderDetailsAnalyticsGoogle } from '../utils/analyticsUtils';

function OrderNoColumn({ id, detailUrl }) {
  return detailUrl && !isJavaScriptProtocol.test(detailUrl) ? (
    <a
      href={`${detailUrl}.html?id=${id}`}
      onClick={() => getOrderDetailsAnalyticsGoogle(id)}
    >
      {id}
    </a>
  ) : (
    <span>{id}</span>
  );
}

export default OrderNoColumn;
