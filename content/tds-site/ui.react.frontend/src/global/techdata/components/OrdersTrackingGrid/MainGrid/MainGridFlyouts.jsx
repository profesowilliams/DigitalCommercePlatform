import React from 'react';
import DNotesFlyout from '../../DNotesFlyout/DNotesFlyout';
import ExportFlyout from '../../ExportFlyout/ExportFlyout';
import InvoicesFlyout from '../../InvoicesFlyout/InvoicesFlyout';
import OrderFilterFlyout from '../Filter/OrderFilterFlyout';
import OrderModificationFlyout from '../../OrdersTrackingDetail/ModificationFlyout/OrderModificationFlyout';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

const MainGridFlyouts = ({
  gridConfig,
  openFilePdf,
  hasAIORights,
  filtersRefs,
  filterLabels,
  downloadFileBlob,
  analyticsCategories,
  onQueryChanged,
  apiResponse,
  gridRef,
  rowsToGrayOutTDNameRef,
  userData,
}) => {
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  function downloadAllFile(flyoutType, orderId, selectedId) {
    return downloadFileBlob(flyoutType, orderId, selectedId);
  }

  return (
    <>
      <DNotesFlyout
        store={useOrderTrackingStore}
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
      />
      <OrderFilterFlyout
        onQueryChanged={onQueryChanged}
        filtersRefs={filtersRefs}
        isTDSynnex={isTDSynnex}
        filterLabels={filterLabels}
        analyticsCategories={analyticsCategories}
        subheaderReference={document.querySelector('.subheader > div > div')}
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
    </>
  );
};
export default MainGridFlyouts;
