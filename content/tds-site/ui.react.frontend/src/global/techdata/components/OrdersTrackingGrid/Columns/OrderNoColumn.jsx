import React, { useState } from 'react';
import { isJavaScriptProtocol } from '../../../../../utils/utils';
import { getOrderDetailsAnalyticsGoogle } from '../utils/analyticsUtils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';
import { CopyIcon, TickIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { getLocalStorageData } from '../utils/gridUtils';
import Tooltip from '@mui/material/Tooltip';
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';

function OrderNoColumn({ id, detailUrl, isInternalUser }) {
  const [copied, setCopied] = useState(false);
  const saleslogin = getUrlParamsCaseInsensitive().get('saleslogin');
  const salesLoginParam = saleslogin ? `&saleslogin=${saleslogin}` : '';
  const queryCacheKey = getLocalStorageData(
    ORDER_PAGINATION_LOCAL_STORAGE_KEY
  )?.queryCacheKey;
  const queryCacheKeyParam = queryCacheKey ? `&q=${queryCacheKey}` : '';

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

  return detailUrl && !isJavaScriptProtocol.test(detailUrl) ? (
    <div className="link-underline-column">
      <a
        href={`${location.href.substring(
          0,
          location.href.lastIndexOf('.')
        )}/order-details.html?id=${id}${queryCacheKeyParam}${salesLoginParam}`}
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