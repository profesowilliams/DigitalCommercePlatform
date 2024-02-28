import React from 'react';
import { getDictionaryValueOrKey, addUrlParam } from '../../../../../../../utils/utils';
import { usGet } from '../../../../../../../utils/api';
import { getTrackAndTraceAnalyticsGoogle, pushDataLayerGoogle } from '../../../utils/analyticsUtils';

function TrackColumn({ line, config, id }) {
  const trackAndTraceAvailable = line?.canTrackAndTrace;
  const trackAndTraceCounter = useOrderTrackingStore((state) => state.trackAndTraceCounter);
  const { setTrackAndTraceCounter } = useOrderTrackingStore((st) => st.effects);

  const handleTrackAndTrace = async () => {
    pushDataLayerGoogle(
      getTrackAndTraceAnalyticsGoogle(trackAndTraceCounter, true)
    );
    setTrackAndTraceCounter(trackAndTraceCounter+1);
    try {
      const enableLineId = line?.items?.length === 1;
      const orderId = id;
      const lineId = line?.items[0]?.line;
      const dNoteId = line?.id;

      const endpointUrl = enableLineId
        ? `${config.uiCommerceServiceDomain}/v3/order/carrierurl/${orderId}/${lineId}/${dNoteId}`
        : `${config.uiCommerceServiceDomain}/v3/order/carrierurl/${orderId}/${dNoteId}`;
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        let trackAndTraceParams = '';
        if (parameters) {
          Object.entries(parameters).forEach((entry) =>
            trackAndTraceParams = addUrlParam(trackAndTraceParams, entry[0], entry[1])
          );
        }
        window.open(baseUrl + trackAndTraceParams, '_blank');
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
