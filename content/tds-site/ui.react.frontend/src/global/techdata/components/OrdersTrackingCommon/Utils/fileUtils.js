import { pushFailedDownloadGoogleAnalytics, pushSuccessDownloadGoogleAnalytics, } from './analyticsUtils';
import { requestFileBlobWithoutModal } from '../../../../../utils/utils';

export async function downloadFile(baseUrl, flyoutType, orderId, selectedId) {
  console.log('FileUtils::downloadFileBlob::' + orderId);

  const url = `${baseUrl}/v3/orders/downloaddocuments`;
  const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
  const downloadUrl = url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;

  try {
    const response = await requestFileBlobWithoutModal(downloadUrl, null, { redirect: false });

    const successCounter = response?.headers['ga-download-documents-success'] ?? 0;
    const failCounter = response?.headers['ga-download-documents-fail'] ?? 0;
    const counter = getFormattedCounter(successCounter, failCounter);

    if (response?.status === 200 && successCounter > 0) {
      pushSuccessDownloadGoogleAnalytics(flyoutType, false, counter, orderId, mapIds);
      return true;
    } else {
      pushFailedDownloadGoogleAnalytics(flyoutType, false, counter, orderId, mapIds);
      return false;
    }
  } catch (error) {
    pushFailedDownloadGoogleAnalytics(flyoutType, false, 1, orderId, mapIds);
    console.log('OrdersTrackingDetail::downloadFileBlob::' + error);
    return false;
  }
};

export async function openFile(baseUrl, flyoutType, orderId, selectedId) {
  console.log('FileUtils::openFile::' + orderId);

  const url = `${baseUrl}/v3/orders/downloaddocuments`;
  const downloadUrl = url + `?order=${orderId}&type=${flyoutType}&id=${selectedId}`;

  try {
    const response = await requestFileBlobWithoutModal(downloadUrl, null, { redirect: true, });

    const successCounter = response?.headers['ga-download-documents-success'] ?? 0;
    const failCounter = response?.headers['ga-download-documents-fail'] ?? 0;
    const counter = getFormattedCounter(successCounter, failCounter);

    if (response?.status === 200 && successCounter > 0) {
      pushSuccessDownloadGoogleAnalytics(flyoutType, false, counter, orderId, selectedId);
      return true;
    } else {
      pushFailedDownloadGoogleAnalytics(flyoutType, false, counter, orderId, selectedId);
      return false;
    }
  } catch (error) {
    pushFailedDownloadGoogleAnalytics(flyoutType, false, 1, orderId, selectedId);
    console.log('OrdersTrackingDetail::openFile::' + error);
    return false;
  }
}

/**
* Returns a formatted string based on success and fail counters.
* If both counters are greater than 0, it returns "successCounter/failCounter".
* If only one counter is greater than 0, it returns that counter.
* If both counters are 0, it returns an empty string.
* @param {number} successCounter - The success counter value.
* @param {number} failCounter - The fail counter value.
* @returns {string | null} - The formatted string or null if both counters are 0.
*/
const getFormattedCounter = (successCounter, failCounter) => {
  if (successCounter > 0 && failCounter > 0) {
    return `${successCounter}/${failCounter}`;
  } else if (successCounter > 0) {
    return `${successCounter}`;
  } else if (failCounter > 0) {
    return `${failCounter}`;
  } else {
    return ``;
  }
};