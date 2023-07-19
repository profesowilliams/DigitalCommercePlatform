import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import {
  getDNoteViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';

//TODO: delete invoices prop form DeliveryNotesColumn after BE create mock request for downloading dnotes
function DeliveryNotesColumn({
  deliveryNotes = [],
  multiple,
  id,
  reseller,
  openFilePdf,
}) {
  const hasMultiple = deliveryNotes.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: { data: deliveryNotes, show: true, id: id, reseller: reseller.id },
    });
    pushDataLayerGoogle(
      getDNoteViewAnalyticsGoogle(deliveryNotes.length, 'Main Grid')
    );
  };

  //TODO: change to use Denotes after BE create mock request for downloading dnotes
  const handleDownload = () => {
    openFilePdf('DNote', id, deliveryNotes[0]?.id);
  };
  return deliveryNotes.length == 0 ? (
    '-'
  ) : (
    <div onClick={hasMultiple ? triggerDNotesFlyout : handleDownload}>
      <a>
        {hasMultiple ? getDictionaryValueOrKey(multiple) : deliveryNotes[0]?.id}
      </a>
    </div>
  );
}

export default DeliveryNotesColumn;
