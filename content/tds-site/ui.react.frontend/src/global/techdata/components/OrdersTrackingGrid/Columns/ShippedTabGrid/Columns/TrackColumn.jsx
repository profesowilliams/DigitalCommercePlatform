import React from 'react';
import { addUrlParam } from '../../../../../../../utils/utils';
import { usGet } from '../../../../../../../utils/api';
import { getTrackAndTraceAnalyticsGoogle, pushDataLayerGoogle } from '../../../Utils/analyticsUtils';
import { useOrderTrackingStore } from '../../../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * TrackColumn component handles the "Track" or "Activate Here" functionality in the shipped orders grid.
 * It opens the carrier's tracking URL in a new tab and pushes tracking analytics to Google.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.line - The line item data.
 * @param {Object} props.config - The configuration object with necessary URLs.
 * @param {string} props.id - The order ID.
 * @returns {JSX.Element} The rendered tracking link or empty string.
 */
function TrackColumn({ line, config, id }) {
  // Fetch translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Expand.ShippedTab'];

  // Flags for determining if "Activate Here" or "Track" options are available
  const activateHereAvailable = line?.activateHere;
  const trackAndTraceAvailable = line?.canTrackAndTrace;

  // Get and set the track and trace counter from the store
  const trackAndTraceCounter = useOrderTrackingStore(
    (state) => state.trackAndTraceCounter
  );
  const { setTrackAndTraceCounter } = useOrderTrackingStore((st) => st.effects);

  /**
   * Handles the Track and Trace functionality.
   * It fetches the tracking URL from the backend and opens it in a new tab,
   * while also logging the tracking event in Google Analytics.
   */
  const handleTrackAndTrace = async () => {
    // Increment the track and trace counter
    setTrackAndTraceCounter(trackAndTraceCounter + 1);

    try {
      const enableLineId = line?.items?.length === 1; // Check if there's only one item in the line
      const orderId = id;
      const lineId = line?.items[0]?.line;
      const dNoteId = line?.id;

      // Determine the endpoint URL based on whether there's a single line ID
      const endpointUrl = enableLineId
        ? `${config.uiCommerceServiceDomain}/v3/order/carrierurl/${orderId}/${lineId}/${dNoteId}`
        : `${config.uiCommerceServiceDomain}/v3/order/carrierurl/${orderId}/${dNoteId}`;

      // Fetch the tracking URL and parameters
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters, carrier } = result.data;

      // If a base URL is returned, construct the full URL and open it in a new tab
      if (baseUrl) {
        let trackAndTraceParams = '';
        if (parameters) {
          Object.entries(parameters).forEach(
            (entry) =>
            (trackAndTraceParams = addUrlParam(
              trackAndTraceParams,
              entry[0],
              entry[1]
            ))
          );
        }
        window.open(baseUrl + trackAndTraceParams, '_blank');

        // Push the tracking event to Google Analytics
        pushDataLayerGoogle(
          getTrackAndTraceAnalyticsGoogle(trackAndTraceCounter, false, carrier)
        );
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
        ? activateHereAvailable
          ? translations?.ActivateHere || 'Activate Here'
          : translations?.Track || 'Track'
        : ''}
    </div>
  );
}

export default TrackColumn;