import {
  pushFailedDownloadGoogleAnalytics,
  pushSuccessDownloadGoogleAnalytics,
} from '../../OrdersTrackingGrid/utils/analyticsUtils'; // move to common!
import { requestFileBlobWithoutModal } from '../../../../../utils/utils';

export async function downloadFile(baseUrl, flyoutType, orderId, selectedId) {
  console.log('OrdersTrackingDetail::downloadFileBlob::' + orderId);
  try {
    const url = `${baseUrl}/v3/orders/downloaddocuments`;
    const mapIds = selectedId.map((ids) => `&id=${ids}`).join('');
    const downloadOrderInvoicesUrl =
      url + `?Order=${orderId}&Type=${flyoutType}${mapIds}`;
    const response = await requestFileBlobWithoutModal(downloadOrderInvoicesUrl, null, { redirect: false });

    if (response?.status === 200) {
      const successCounter = response?.headers['Ga-Download-Documents-Success'];
      pushSuccessDownloadGoogleAnalytics(flyoutType, false, successCounter, orderId, mapIds);
    } else if (response?.status === 204) {
      const failCounter = response?.headers['Ga-Download-Documents-Fail'];
      pushFailedDownloadGoogleAnalytics(flyoutType, false, failCounter, orderId, mapIds);
    }
  } catch (error) {
    pushFailedDownloadGoogleAnalytics(flyoutType, false, 1, orderId, mapIds);
    console.log('OrdersTrackingDetail::downloadFileBlob::' + error);
  }
};

export async function openFile(baseUrl, flyoutType, orderId, selectedId) {
  const url = `${baseUrl}/v3/orders/downloaddocuments`;
  const singleDownloadUrl = url + `?order=${orderId}&type=${flyoutType}&id=${selectedId}`;

  let response = null;
  try {
    response = await requestFileBlobWithoutModal(singleDownloadUrl, null, { redirect: true, });

    if (response?.status === 200) {
      const successCounter = response?.headers['Ga-Download-Documents-Success'];
      pushSuccessDownloadGoogleAnalytics(flyoutType, false, successCounter, orderId, selectedId);
    } else if (response?.status === 204) {
      const failCounter = response?.headers['Ga-Download-Documents-Fail'];
      pushFailedDownloadGoogleAnalytics(flyoutType, false, failCounter, orderId, selectedId);
    }
  } catch (error) {
    pushFailedDownloadGoogleAnalytics(flyoutType, false, 1, orderId, selectedId);
  }
}