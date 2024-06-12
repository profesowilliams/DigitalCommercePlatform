import React from 'react';
import {
  ArrowExitIcon,
  ArrowExitIconFilled,
} from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import Hover from '../../Hover/Hover';
import {
  getExportAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import {
  endpoints,
  setSearchCriteriaDefaultDateRange,
} from '../utils/orderTrackingUtils';
import { requestFileBlobWithoutModal } from '../../../../../utils/utils';

function OrderExport({
  gridConfig,
  searchParams,
  exportAnalyticsLabel
}) {
  const uiTranslations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const alternativeSearchFlag = useOrderTrackingStore(
    (state) => state.featureFlags.alternativeSearch
  );
  const translations = uiTranslations?.['OrderTracking.MainGrid.Export'];

  const url = gridConfig?.uiCommerceServiceDomain + endpoints.exportAllOrderLines || 'nourl';
  const requestUrl = new URL(url);
  let urlSearchParams = requestUrl.searchParams;
  const { reports, sort, search, filtersRefs } = searchParams || {};

  if (searchParams) {
    const sortValue = sort.current?.sortData?.[0];
    if (sortValue) {
      urlSearchParams.set('SortDirection', sortValue.sort);
      urlSearchParams.set('SortBy', sortValue.colId);
    }

    const reportValue = reports.current?.value;
    if (reportValue) {
      urlSearchParams.set('reportName', reportValue);
    } else {

      setSearchCriteriaDefaultDateRange({
        searchCriteria: search,
        requestUrl: requestUrl,
        filtersRefs: filtersRefs,
      });

      const { field, value } = search.current || {};
      if (field) {
        if (alternativeSearchFlag) {
          urlSearchParams.set('key', field);
          urlSearchParams.set('value', value);
        }
      }

      filtersRefs.current &&
        Object.entries(filtersRefs.current).reduce((params, filter) => {
          if (filter[1] && (filter[0] === 'status' || filter[0] === 'type')) {
            filter[1].split('&').forEach((e) => {
              if (!e) {
                return;
              }
              let key = e.split('=');
              urlSearchParams.append(key[0], key[1]);
            });
          } else if (filter[1]) {
            urlSearchParams.set(filter[0], filter[1]);
          }
        }, '');
    }
  } 

  const effects = useOrderTrackingStore((st) => st.effects);

  function getExportAll() {
    return requestFileBlobWithoutModal(
      url + '?' + urlSearchParams.toString(),
      '',
      {
        redirect: false,
      }
    );
  }

  const handleDownload = () => {
    pushDataLayerGoogle(
      getExportAnalyticsGoogle(exportAnalyticsLabel, 'all')
    );

    const toaster = {
      isOpen: true,
      origin: 'fromUpdate',
      isAutoClose: true,
      isSuccess: true,
      message: translations?.Message_DownloadTriggered,
    };

    effects.setCustomState({ key: 'toaster', value: { ...toaster } });

    getExportAll()
        .then(() => {
          const toaster = {
            isOpen: true,
            origin: 'fromUpdate',
            isAutoClose: true,
            isSuccess: true,
            message: translations?.Message_Success,
          };

          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        })
        .catch(() => {
          const toaster = {
            isOpen: true,
            origin: 'fromUpdate',
            isAutoClose: true,
            isSuccess: false,
            message: translations?.Message_Failed,
          };
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        });
  };

  return (
    <Tooltip
      title={translations?.Tooltip}
      placement="top"
      arrow
      disableInteractive={true}
    >
      <div
        className="cmp-order-tracking-grid__export"
        onClick={handleDownload}
      >
        <Hover onHover={<ArrowExitIconFilled className="icon-hover" />}>
          <ArrowExitIcon className="icon-hover" />
        </Hover>
      </div>
    </Tooltip>
  );
}

export default OrderExport;
