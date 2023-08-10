import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
function TrackColumn({ line, config }) {
  return (
    <div className="order-line-details__content__track">
      {getDictionaryValueOrKey(config?.orderLineDetails?.trackLabel)}
    </div>
  );
}
export default TrackColumn;
