export const pushDataLayerGoogle = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

/**
 * Generates Google Analytics data for tracking download events.
 * @param {string} event - The type of event (e.g., 'D-Note View', 'Invoice View').
 * @param {boolean} success - Indicates whether the download was successful.
 * @param {number} counter - A counter or identifier for the event.
 * @param {boolean} isMainGrid - Indicates if the event is related to the main grid or order details.
 * @param {string} orderId - The ID of the order.
 * @param {string} documentId - The ID of the document.
 * @returns {Object} - The formatted analytics data object.
 */
const getAnalyticsGoogleData = (event, success, counter, isMainGrid, orderId, documentId) => {
  return {
    event: `Order tracking - ${event}`,
    orderTracking: `${event} ${success ? 'download success' : 'download failed'}: ${counter} ${orderId} ${documentId}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
};

/**
 * Pushes success download event data to Google Analytics.
 * @param {string} flyoutType - The type of the document (e.g., 'DNote', 'Invoice').
 * @param {boolean} isMainGrid - Indicates if the event is related to the main grid or order details.
 * @param {number} counter - A counter or identifier for the event.
 * @param {string} orderId - The ID of the order.
 * @param {string} documentId - The ID of the document.
 */
export const pushSuccessDownloadGoogleAnalytics = (flyoutType, isMainGrid, counter, orderId, documentId) => {
  let event;
  if (flyoutType === 'DNote') {
    event = 'D-Note View';
  } else if (flyoutType === 'Invoice') {
    event = 'Invoice View';
  }

  if (event) {
    pushDataLayerGoogle(getAnalyticsGoogleData(event, true, counter, isMainGrid, orderId, documentId));
  }
};

/**
 * Pushes failed download event data to Google Analytics.
 * @param {string} flyoutType - The type of the document (e.g., 'DNote', 'Invoice').
 * @param {boolean} isMainGrid - Indicates if the event is related to the main grid or order details.
 * @param {number} counter - A counter or identifier for the event.
 * @param {string} orderId - The ID of the order.
 * @param {string} documentId - The ID of the document.
 */
export const pushFailedDownloadGoogleAnalytics = (flyoutType, isMainGrid, counter, orderId, documentId) => {
  let event;
  if (flyoutType === 'DNote') {
    event = 'D-Note View';
  } else if (flyoutType === 'Invoice') {
    event = 'Invoice View';
  }

  if (event) {
    pushDataLayerGoogle(getAnalyticsGoogleData(event, false, counter, isMainGrid, orderId, documentId));
  }
};