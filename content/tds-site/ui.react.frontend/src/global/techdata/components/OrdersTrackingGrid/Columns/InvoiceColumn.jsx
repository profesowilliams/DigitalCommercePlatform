import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  getInvoiceViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import Tooltip from '@mui/material/Tooltip';
import { CopyIcon, TickIcon } from '../../../../../fluentIcons/FluentIcons';

function InvoiceColumn({
  invoices = [],
  multiple,
  id,
  reseller,
  openFilePdf,
  isInternalUser,
}) {
  const [copied, setCopied] = useState(false);
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const hasMultiple = invoices?.length > 1;
  const firstInvoice = invoices ? invoices[0] : [];
  const isInvoiceDownloadable = firstInvoice?.canDownloadDocument;
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: {
        data: null,
        show: true,
        id: id,
        reseller: reseller ? reseller : '-',
      },
    });
    pushDataLayerGoogle(
      getInvoiceViewAnalyticsGoogle(invoices?.length, 'Main Grid')
    );
  };

  const handleTooltipClick = () => {
    navigator.clipboard.writeText(
      hasMultiple ? getDictionaryValueOrKey(multiple) : firstInvoice?.id
    );
    setCopied(true);
  };

  const handleTooltip = () => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const translations = useOrderTrackingStore((state) => state.uiTranslations);

  const mainGridTranslations = translations?.['OrderTracking.MainGrid'];

  const tooltipMessage =
    copied ? (
      <span className="tooltip-span">
        <TickIcon fill="green" className="copy-icon" />
        {mainGridTranslations?.Tooltip_Copied}
      </span>
    ) : (
      <span className="tooltip-span" onClick={handleTooltipClick}>
        <CopyIcon fill="white" className="copy-icon" />
        {mainGridTranslations?.Tooltip_Copy}
      </span>
    );

  const handleDownload = () => {
    if (isInvoiceDownloadable) {
      openFilePdf('Invoice', id, firstInvoice?.id);
      pushDataLayerGoogle(getInvoiceViewAnalyticsGoogle(1, 'Main Grid'));
    }
  };

  const renderContent = () => {
    const contentTooltip = !isInvoiceDownloadable ? (
      <div>{firstInvoice?.id}</div>
    ) : (
      <div onClick={hasMultiple ? triggerInvoicesFlyout : handleDownload}>
        <a>
          {hasMultiple
            ? getDictionaryValueOrKey(multiple)
            : firstInvoice?.id}
        </a>
      </div>
    );

    return isInternalUser ? (
      <Tooltip
        title={tooltipMessage}
        placement="top-end"
        disableInteractive={false}
        leaveDelay={copied ? 1000 : 0}
        onClose={handleTooltip}
      >
        {contentTooltip}
      </Tooltip>
    ) : contentTooltip;
  };

  return invoices?.length === 0 ? '-' : renderContent();
}

export default InvoiceColumn;
