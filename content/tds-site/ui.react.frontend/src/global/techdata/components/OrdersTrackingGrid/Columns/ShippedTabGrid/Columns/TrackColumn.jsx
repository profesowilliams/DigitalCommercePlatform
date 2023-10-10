import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import { usGet } from '../../../../../../../utils/api';

function TrackColumn({ line, config, id }) {
  const [trackUrl, setTrackUrl] = useState('');
  const trackAndTraceAvailable = line?.id?.length > 0;
  const enableLineId = line?.items?.lenght === 1;
  const handleTrackAndTrace = () => {
    window.open(trackUrl, '_blank');
  };

  useEffect(async () => {
    try {
      const result = await usGet(
        `${config.trackDeliveryEndpoint}/${id}/${
          enableLineId && line?.items[0]?.line + '/'
        }${line.id}`
      );
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        const urlParams =
          '?' +
          Object.entries(parameters)
            .map((entry) => entry[0] + '=' + entry[1])
            .join('&');
        setTrackUrl(baseUrl + urlParams);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <div
      className="order-line-details__content__trackLink"
      onClick={trackAndTraceAvailable && handleTrackAndTrace}
    >
      {getDictionaryValueOrKey(config?.orderLineDetails?.trackLabel)}
    </div>
  );
}
export default TrackColumn;
