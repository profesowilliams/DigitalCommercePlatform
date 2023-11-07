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
    openFilePdf('DNote', id, deliveryNotes[0].Id);
    pushDataLayerGoogle(getDNoteViewAnalyticsGoogle(1, 'Main Grid'));
  };

  return deliveryNotes?.length === 0 ? ('-') : 
  (
    !deliveryNotes[0].canDownloadDocument 
      ? deliveryNotes[0].id
      : (<div onClick={hasMultiple ? triggerDNotesFlyout : handleDownload}>
         <a>{hasMultiple ? getDictionaryValueOrKey(multiple) : deliveryNotes[0].id}</a>
         </div>)
  );
}

export default DeliveryNotesColumn;
