import React, { useState } from 'react';
import { isJavaScriptProtocol } from '../../../../../utils/utils';
import { getOrderDetailsAnalyticsGoogle } from '../utils/analyticsUtils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';
import { CopyIcon, TickIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

import Tooltip from '@mui/material/Tooltip';

function OrderNoColumn({ id, detailUrl, isInternalUser}) {
  const [copied, setCopied] = useState(false);
  const saleslogin = getUrlParamsCaseInsensitive().get('saleslogin');
  const salesLoginParam = saleslogin ? `&saleslogin=${saleslogin}` : '';

  const handleTooltipClick = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
  };

  const translations = useOrderTrackingStore((state) => state.uiTranslations);

  const mainGridTranslations = translations?.['OrderTracking.MainGrid'];

  const tooltipMessage = copied ? (
    <span className="tooltip-span">
      <TickIcon fill="green" className="copy-icon" />
      {mainGridTranslations?.Tooltip_Copied}
    </span>
  ) : (
    <span onClick={handleTooltipClick} className="tooltip-span">
      <CopyIcon fill="white" className="copy-icon" />
      {mainGridTranslations?.Tooltip_Copy}
    </span>
  );

  return isInternalUser ? (
    detailUrl && !isJavaScriptProtocol.test(detailUrl) ? (
      <a
        href={`${location.href.substring(
          0,
          location.href.lastIndexOf('.')
        )}/order-details.html?id=${id}${salesLoginParam}`}
        onClick={() => getOrderDetailsAnalyticsGoogle(id)}
      >
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
      </a>
    ) : (
      <Tooltip>
        <span>{id}</span>
      </Tooltip>
    )
  ) : (
    <span>{id}</span>
  );
}

export default OrderNoColumn;
