import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';


function DeliveryNotesColumn({ deliveryNotes = [], multiple}) {
  const hasMultiple = deliveryNotes.length > 1;
  return (
    deliveryNotes.length == 0 ? "-" :
      <a href="#">
        {(hasMultiple ? getDictionaryValueOrKey(multiple) : deliveryNotes[0]?.id)}
      </a>
  );
}

export default DeliveryNotesColumn;
