import { pushFailedDownloadGoogleAnalytics, pushSuccessDownloadGoogleAnalytics, } from './analyticsUtils';
import { requestFileBlobWithoutModal } from '../../../../../utils/utils';

export async function downloadFile(baseUrl, flyoutType, orderId, selectedId) {
  console.log('FileUtils::downloadFileBlob::' + orderId);

  const url = `${baseUrl}/v3/orders/downloaddocuments`;
  const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
  const downloadUrl = url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;

  try {
    const response = await requestFileBlobWithoutModal(downloadUrl, null, { redirect: false });

    if (response?.status === 200) {
      const successCounter = response?.headers['ga-download-documents-success'];
      pushSuccessDownloadGoogleAnalytics(flyoutType, false, successCounter, orderId, mapIds);
      return true;
    } else if (response?.status === 204) {
      const failCounter = response?.headers['ga-download-documents-fail'];
      pushFailedDownloadGoogleAnalytics(flyoutType, false, failCounter, orderId, mapIds);
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

    if (response?.status === 200) {
      const successCounter = response?.headers['ga-download-documents-success'];
      pushSuccessDownloadGoogleAnalytics(flyoutType, false, successCounter, orderId, selectedId);
      return true;
    } else if (response?.status === 204) {
      const failCounter = response?.headers['ga-download-documents-fail'];
      pushFailedDownloadGoogleAnalytics(flyoutType, false, failCounter, orderId, selectedId);
      return false;
    }
  } catch (error) {
    pushFailedDownloadGoogleAnalytics(flyoutType, false, 1, orderId, selectedId);
    console.log('OrdersTrackingDetail::openFile::' + error);
    return false;
  }
}