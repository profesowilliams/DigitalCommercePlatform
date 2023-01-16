import React from 'react';

function DeliveryNotesColumn({ deliveryNotes = [] }) {
  const hasMultiple = deliveryNotes.length > 1;
  return (
    deliveryNotes.length == 0 ? "-" :
      <a href="#">
        {(hasMultiple ? 'multiple' : deliveryNotes[0]?.id)}
      </a>
  );
}

export default DeliveryNotesColumn;
