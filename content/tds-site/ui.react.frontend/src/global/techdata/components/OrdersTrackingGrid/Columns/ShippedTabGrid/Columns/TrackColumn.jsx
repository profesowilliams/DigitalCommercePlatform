import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import { usGet } from '../../../../../../../utils/api';

function TrackColumn({ line, config, id }) {
  const trackAndTraceAvailable = line?.id?.length > 0;
  const enableLineId = line?.items?.length === 1;
  const orderId = id;
  const lineId = line?.items[0]?.line;
  const dNoteId = line.id;

  const handleTrackAndTrace = async () => {
    try {
      const endpointUrl = enableLineId
        ? `${config.trackDeliveryEndpoint}/${orderId}/${lineId}/${dNoteId}`
        : `${config.trackDeliveryEndpoint}/${orderId}/${dNoteId}`;
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        const urlParams =
          '?' +
          Object.entries(parameters)
            .map((entry) => entry[0] + '=' + entry[1])
            .join('&');
        const trackUrl = baseUrl + urlParams;
        window.open(trackUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="order-line-details__content__trackLink"
      onClick={trackAndTraceAvailable ? handleTrackAndTrace : null}
    >
      {getDictionaryValueOrKey(config?.orderLineDetails?.trackLabel)}
    </div>
  );
}

export default TrackColumn;
