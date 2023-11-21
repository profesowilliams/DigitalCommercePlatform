import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  getDNoteViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';

function DeliveryNotesColumn({
  deliveryNotes = [],
  multiple,
  id,
  reseller,
  openFilePdf,
}) {
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
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

  const renderContent = () => {
    return !isDeliveryNoteDownloadable ? (
      firstDeliveryNote?.id
    ) : (
      <div onClick={hasMultiple ? triggerDNotesFlyout : handleDownload}>
        <a>
          {hasMultiple
            ? getDictionaryValueOrKey(multiple)
            : firstDeliveryNote?.id}
        </a>
      </div>
    );
  };

  return deliveryNotes?.length === 0 ? '-' : renderContent();
}

export default DeliveryNotesColumn;
