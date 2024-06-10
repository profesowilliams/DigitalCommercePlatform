import {
  getExportAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../../OrdersTrackingGrid/utils/analyticsUtils';
import {
  endpoints,
} from '../../OrdersTrackingGrid/utils/orderTrackingUtils';
import { requestFileBlobWithoutModal } from '../../../../../utils/utils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils/index';

function getExportAll(url, urlSearchParams) {
  return requestFileBlobWithoutModal(
    url + '?' + urlSearchParams.toString(),
    '',
    {
      redirect: false,
    }
  );
}

export function handleDownloadExcelExport(exportConfig) {
  const url = exportConfig?.config?.uiCommerceServiceDomain + endpoints.exportAllOrderLines || 'nourl';
  const requestUrl = new URL(url);
  let urlSearchParams = requestUrl.searchParams;
  const id = getUrlParamsCaseInsensitive().get("id");
  urlSearchParams.set('Id', id);

  pushDataLayerGoogle(
    getExportAnalyticsGoogle('export', 'all')
  );

  const toaster = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: true,
    message: exportConfig?.translations?.Message_DownloadTriggered,
  };

  exportConfig?.effects.setCustomState({ key: 'toaster', value: { ...toaster } });

  getExportAll(url, urlSearchParams)
    .then(() => {
      const toaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: true,
        message: exportConfig?.translations?.Message_Success,
      };

      exportConfig?.effects.setCustomState({ key: 'toaster', value: { ...toaster } });
    })
    .catch(() => {
      const toaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: false,
        message: exportConfig?.translations?.Message_Failed,
      };
      exportConfig?.effects.setCustomState({ key: 'toaster', value: { ...toaster } });
    });
};