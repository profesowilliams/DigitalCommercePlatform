import React, { useState } from 'react';
import { isJavaScriptProtocol } from '../../../../../utils/utils';
import { getOrderDetailsAnalyticsGoogle } from '../Utils/analyticsUtils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';
import { CopyIcon, TickIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';

function OrderNoColumn({ id, detailUrl, isInternalUser }) {
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid'];
  const [copied, setCopied] = useState(false);

  // Get the current URL parameters
  const params = getUrlParamsCaseInsensitive();
  const saleslogin = params.get('saleslogin');
  const queryCacheKey = params.get('q');

  const handleTooltipClick = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
  };

  const buildOrderDetailsUrl = (id) => {
    // Build the base URL up to the last period (.)
    const currentUrl = new URL(window.location.href);
    const baseUrl = `${currentUrl.origin}${currentUrl.pathname.substring(
      0,
      currentUrl.pathname.lastIndexOf('.')
    )}/order-details.html`;

    // Create a new URL object for the order details URL
    const orderDetailsUrl = new URL(baseUrl);

    // Set the required id parameter
    orderDetailsUrl.searchParams.set('id', id);

    // Set optional parameters if they exist
    if (saleslogin) {
      orderDetailsUrl.searchParams.set('saleslogin', saleslogin);
    }
    if (queryCacheKey) {
      orderDetailsUrl.searchParams.set('q', queryCacheKey);
    }

    return orderDetailsUrl.toString();
  }

  const tooltipMessage = copied ? (
    <span className="tooltip-span">
      <TickIcon fill="green" className="copy-icon" />
      {translations?.Tooltip_Copied}
    </span>
  ) : (
    <span onClick={handleTooltipClick} className="tooltip-span">
      <CopyIcon fill="white" className="copy-icon" />
        {translations?.Tooltip_Copy}
    </span>
  );

  return detailUrl && !isJavaScriptProtocol.test(detailUrl) ? (
    <div className="link-underline-column">
      <a
        href={buildOrderDetailsUrl(id)}
        onClick={() => getOrderDetailsAnalyticsGoogle(id)}
      >
        {isInternalUser ? (
          <Tooltip
            title={tooltipMessage}
            placement="top-end"
            disableInteractive={false}
            leaveDelay={copied ? 1000 : 0}
            onClose={() => {
              if (copied) {
                setTimeout(() => setCopied(false), 1000);
              }
            }}
          >
            <span>{id}</span>
          </Tooltip>
        )
        : (<span>{id}</span>)}
      </a>
    </div>
  ) : (
    <Tooltip>
      <span>{id}</span>
    </Tooltip>
  );
}

export default OrderNoColumn;