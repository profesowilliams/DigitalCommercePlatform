import React from 'react';
import { isJavaScriptProtocol } from '../../../../../utils/utils';
import { getOrderDetailsAnalyticsGoogle } from '../utils/analyticsUtils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';

function OrderNoColumn({ id, detailUrl }) {
  const { saleslogin = '' } = getUrlParamsCaseInsensitive();
  const salesLoginParam = saleslogin ? `&saleslogin=${saleslogin}` : '';

  return detailUrl && !isJavaScriptProtocol.test(detailUrl) ? (
    <a
      href={`${location.href.substring(
        0,
        location.href.lastIndexOf('.')
      )}/order-details.html?id=${id}${salesLoginParam}`}
      onClick={() => getOrderDetailsAnalyticsGoogle(id)}
    >
      {id}
    </a>
  ) : (
    <span>{id}</span>
  );
}

export default OrderNoColumn;
