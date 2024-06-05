import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  getDNoteViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import Tooltip from '@mui/material/Tooltip';
import { CopyIcon, TickIcon } from '../../../../../fluentIcons/FluentIcons';
import { useState } from 'react';

function DeliveryNotesColumn({
  deliveryNotes = [],
  multiple,
  id,
  reseller,
  openFilePdf,
  isInternalUser,
}) {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const translations = useOrderTrackingStore((state) => state.uiTranslations);
  const mainGridTranslations = translations?.['OrderTracking.MainGrid'];
  
  const [copied, setCopied] = useState(false);
  const hasMultiple = deliveryNotes?.length > 1;
  const firstDeliveryNote = deliveryNotes ? deliveryNotes[0] : [];
  const isDeliveryNoteDownloadable = firstDeliveryNote?.canDownloadDocument;
  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: {
        data: null,
        show: true,
        id: id,
        reseller: reseller ? reseller : '-',
      },
    });
    pushDataLayerGoogle(
      getDNoteViewAnalyticsGoogle(deliveryNotes?.length, 'Main Grid')
    );
  };

  const handleDownload = () => {
    if (isDeliveryNoteDownloadable) {
      openFilePdf('DNote', id, firstDeliveryNote?.id);
      pushDataLayerGoogle(getDNoteViewAnalyticsGoogle(1, 'Main Grid'));
    }
  };

  const handleTooltipClick = () => {
    navigator.clipboard.writeText(
      hasMultiple ? getDictionaryValueOrKey(multiple) : firstDeliveryNote?.id
    );
    setCopied(true);
  };

  const handleTooltip = () => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000);
    }
  }

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

  const renderContent = () => {
    const contentTooltip = !isDeliveryNoteDownloadable ? (
      <div>{firstDeliveryNote?.id}</div>
    ) : (
      <div
        onClick={hasMultiple ? triggerDNotesFlyout : handleDownload}
        className="link-underline-column"
      >
        <a>
          {hasMultiple
            ? getDictionaryValueOrKey(multiple)
            : firstDeliveryNote?.id}
        </a>
      </div>
    );
    return (
      isInternalUser ? 
        <Tooltip
          title={tooltipMessage}
          placement="top-end"
          disableInteractive={false}
          leaveDelay={copied ? 1000 : 0}
          onClose={handleTooltip}
        >
          {contentTooltip}
        </Tooltip>
      : contentTooltip);
  };

  return deliveryNotes?.length === 0 ? '-' : renderContent();
}

export default DeliveryNotesColumn;
