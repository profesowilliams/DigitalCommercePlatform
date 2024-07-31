import React from 'react';
import { ArrowExitIcon, ArrowExitIconFilled, } from '../../../../../fluentIcons/FluentIcons';
import '../../../../../../src/styles/TopIconsBar.scss';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import Hover from '../Hover/Hover';
import { getExportAnalyticsGoogle, pushDataLayerGoogle } from '../Utils/analyticsUtils';
import { requestFileBlobWithoutModal } from '../../../../../utils/utils';
import { getFetchExportUrl } from './Utils/utils';

/**
 * Component for exporting order data to Excel.
 * @param {Object} props - Component props.
 * @param {Object} props.gridConfig - Configuration for the grid.
 * @param {Object} props.searchParams - Parameters used for filtering data to be exported.
 * @param {string} props.exportAnalyticsLabel - Label for export analytics tracking.
 * @returns {JSX.Element} - The rendered component.
 */
function OrderExport({
  gridConfig,
  searchParams,
  exportAnalyticsLabel
}) {
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Export'];
  const effects = useOrderTrackingStore((st) => st.effects);

  /**
   * Handles the export of order data to an Excel file.
   * @returns {Promise} - A promise that resolves when the file is successfully requested.
   */
  function exportToExcel() {
    console.log('OrderExport::exportToExcel');

    return requestFileBlobWithoutModal(
      getFetchExportUrl(gridConfig?.uiCommerceServiceDomain, searchParams),
      '',
      {
        redirect: false,
      }
    );
  }

  /**
   * Handles the download process, including analytics tracking and updating the UI.
   */
  const handleDownload = () => {
    console.log('OrderExport::handleDownload');

    // Track the download event for analytics.
    pushDataLayerGoogle(
      getExportAnalyticsGoogle(exportAnalyticsLabel, 'all')
    );

    // Show a toaster message indicating that the download has been triggered.
    const toasterTriggered = {
      isOpen: true,
      origin: 'fromUpdate',
      isAutoClose: true,
      isSuccess: true,
      message: translations?.Message_DownloadTriggered,
    };

    effects.setCustomState({ key: 'toaster', value: { ...toasterTriggered } });

    // Attempt to export data to Excel and update UI based on success or failure.
    exportToExcel()
      .then(() => {
        const toasterSuccess = {
          isOpen: true,
          origin: 'fromUpdate',
          isAutoClose: true,
          isSuccess: true,
          message: translations?.Message_Success,
        };

        effects.setCustomState({ key: 'toaster', value: { ...toasterSuccess } });
      })
      .catch(() => {
        const toasterFailure = {
          isOpen: true,
          origin: 'fromUpdate',
          isAutoClose: true,
          isSuccess: false,
          message: translations?.Message_Failed,
        };

        effects.setCustomState({ key: 'toaster', value: { ...toasterFailure } });
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