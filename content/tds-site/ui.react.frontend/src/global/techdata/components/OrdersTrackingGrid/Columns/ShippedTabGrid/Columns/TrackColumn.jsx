import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import { usGet } from '../../../../../../../utils/api';

function TrackColumn({ line, config, id }) {
  const trackAndTraceAvailable = line?.canTrackAndTrace ;
  const enableLineId = line?.items?.length === 1;
  const orderId = id;
  const lineId = line?.items[0]?.line;
  const dNoteId = line.id;

  const handleTrackAndTrace = async () => {
    try {
      const endpointUrl = enableLineId
        ? `${uiServiceDomain}/v3/order/carrierurl/${orderId}/${lineId}/${dNoteId}`
        : `${uiServiceDomain}/v3/order/carrierurl/${orderId}/${dNoteId}`;
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        const trackAndTraceUrl = new URL(baseUrl);
        if (parameters) {
          Object.entries(parameters).forEach((entry) =>
            trackAndTraceUrl.searchParams.append(entry[0], entry[1])
          );
        }
        window.open(trackAndTraceUrl.href, '_blank');
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
      {trackAndTraceAvailable
        ? getDictionaryValueOrKey(config?.orderLineDetails?.trackLabel) ||
          'Track'
        : ''}
    </div>
  );
}

export default TrackColumn;
