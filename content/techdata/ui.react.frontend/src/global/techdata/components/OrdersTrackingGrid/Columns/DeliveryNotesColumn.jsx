import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

function DeliveryNotesColumn({ deliveryNotes = [], multiple, id }) {
  const hasMultiple = deliveryNotes.length > 1;
  const { setCustomState } = useOrderTrackingStore((st) => st.effects);
  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: { data: deliveryNotes, show: true, id: id },
    });
  };
  return deliveryNotes.length == 0 ? (
    '-'
  ) : (
    <div onClick={hasMultiple ? triggerDNotesFlyout : null}>
      <a>
        {hasMultiple ? getDictionaryValueOrKey(multiple) : deliveryNotes[0]?.id}
      </a>
    </div>
  );
}

export default DeliveryNotesColumn;
