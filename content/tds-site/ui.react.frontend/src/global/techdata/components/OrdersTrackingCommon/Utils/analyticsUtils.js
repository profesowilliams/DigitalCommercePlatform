export const pushDataLayerGoogle = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

export const pushSuccessDownloadGoogleAnalytics = (
  flyoutType,
  isMainGrid,
  counter,
  orderId,
  documentId
) => {
  if (flyoutType === 'DNote') {
    pushDataLayerGoogle(
      getDNoteViewAnalyticsGoogle(counter, isMainGrid, orderId, documentId)
    );
  } else if (flyoutType === 'Invoice') {
    pushDataLayerGoogle(
      getInvoiceViewAnalyticsGoogle(counter, isMainGrid, orderId, documentId)
    );
  }
}

const getInvoiceViewAnalyticsGoogle = (
  counter,
  isMainGrid,
  orderId,
  documentId
) => {
  return {
    event: 'Order tracking - Invoice View',
    orderTracking: `Invoice View download success: ${counter} ${orderId} ${documentId}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
};

export const pushFailedDownloadGoogleAnalytics = (
  flyoutType,
  isMainGrid,
  counter,
  orderId,
  documentId
) => {
  if (flyoutType === 'DNote') {
    pushDataLayerGoogle(
      getDNoteDownloadFailedAnalyticsGoogle(
        counter,
        isMainGrid,
        orderId,
        documentId
      )
    );
  } else if (flyoutType === 'Invoice') {
    pushDataLayerGoogle(
      getInvoiceDownloadFailedAnalyticsGoogle(
        counter,
        isMainGrid,
        orderId,
        documentId
      )
    );
  }
};

export const getDNoteDownloadFailedAnalyticsGoogle = (counter, isMainGrid, orderId, documentId) => {
  return {
    event: 'Order tracking - D-Note View download failed',
    orderTracking: `D-Note View download failed: ${counter} ${orderId} ${documentId}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
};

export const getInvoiceDownloadFailedAnalyticsGoogle = (
  counter,
  isMainGrid,
  orderId,
  documentId
) => {
  return {
    event: 'Order tracking - Invoice View download failed',
    orderTracking: `Invoice View download failed: ${counter} ${orderId} ${documentId}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
};