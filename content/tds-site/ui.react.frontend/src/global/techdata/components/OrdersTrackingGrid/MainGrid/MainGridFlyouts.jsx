import React from 'react';
import DNotesFlyout from '../../DNotesFlyout/DNotesFlyout';
import ExportFlyout from '../../ExportFlyout/ExportFlyout';
import InvoicesFlyout from '../../InvoicesFlyout/InvoicesFlyout';
import OrderFilterFlyout from '../Filter/OrderFilterFlyout';
import OrderModificationFlyout from '../../OrdersTrackingDetail/ModificationFlyout/OrderModificationFlyout';
import SettingsFlyout from '../../SettingsFlyout/SettingsFlyout';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

const MainGridFlyouts = ({
  gridConfig,
  openFilePdf,
  hasAIORights,
  filterLabels,
  downloadFileBlob,
  analyticsCategories,
  onQueryChanged,
  apiResponse,
  gridRef,
  rowsToGrayOutTDNameRef,
  userData,
  searchParams,
  resetReports,
  defaultDateRange,
}) => {
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  function downloadAllFile(flyoutType, orderId, selectedId) {
    return downloadFileBlob(flyoutType, orderId, selectedId);
  }

  return (
    <>
      <DNotesFlyout
        store={useOrderTrackingStore}
        gridConfig={gridConfig}
        dNotesFlyout={gridConfig.dNotesFlyout}
        dNoteColumnList={gridConfig.dNoteColumnList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
        downloadAllFile={(flyoutType, orderId, selectedId) =>
          downloadAllFile(flyoutType, orderId, selectedId)
        }
        openFilePdf={(flyoutType, orderId, selectedId) =>
          openFilePdf(flyoutType, orderId, selectedId)
        }
      />
      <InvoicesFlyout
        store={useOrderTrackingStore}
        gridConfig={gridConfig}
        invoicesFlyout={gridConfig.invoicesFlyout}
        invoicesColumnList={gridConfig.invoicesColumnList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
        downloadAllFile={(flyoutType, orderId, selectedId) =>
          downloadAllFile(flyoutType, orderId, selectedId)
        }
        openFilePdf={(flyoutType, orderId, selectedId) =>
          openFilePdf(flyoutType, orderId, selectedId)
        }
        hasAIORights={hasAIORights}
      />
      <ExportFlyout
        store={useOrderTrackingStore}
        componentProp={gridConfig}
        exportFlyout={gridConfig.exportFlyout}
        exportOptionsList={gridConfig.exportOptionsList}
        exportSecondaryOptionsList={gridConfig.exportSecondaryOptionsList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
        exportAnalyticsLabel={analyticsCategories.export}
        searchParams={searchParams}
        defaultDateRange={defaultDateRange}
      />
      <OrderFilterFlyout
        onQueryChanged={onQueryChanged}
        filtersRefs={searchParams.filters}
        isTDSynnex={isTDSynnex}
        filterLabels={filterLabels}
        analyticsCategories={analyticsCategories}
        subheaderReference={document.querySelector('.subheader > div > div')}
        resetReports={resetReports}
      />
      <OrderModificationFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        content={apiResponse?.content}
        labels={gridConfig.orderModifyLabels}
        config={gridConfig}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        userData={userData}
      />
      <SettingsFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={gridConfig.settingsFlyoutLabels}
      />
    </>
  );
};
export default MainGridFlyouts;
