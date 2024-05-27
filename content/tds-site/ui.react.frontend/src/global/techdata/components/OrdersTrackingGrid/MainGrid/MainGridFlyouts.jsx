import React from 'react';
import DNotesFlyout from '../../DNotesFlyout/DNotesFlyout';
import ExportFlyout from '../../ExportFlyout/ExportFlyout';
import InvoicesFlyout from '../../InvoicesFlyout/InvoicesFlyout';
import OrderFilterFlyout from '../Filter/OrderFilterFlyout';
import OrderModificationFlyout from '../../OrdersTrackingDetail/ModificationFlyout/OrderModificationFlyout';
import SettingsFlyout from '../../SettingsFlyout/SettingsFlyout';
import ProductReplacementFlyout from '../../ReplacementFlyout/ProductReplacementFlyout';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

const MainGridFlyouts = ({
  gridConfig,
  openFilePdf,
  filterLabels,
  downloadFileBlob,
  analyticsCategories,
  onQueryChanged,
  userData,
  searchParams,
  settings,
  rowsToGrayOutTDNameRef,
  addNewItem,
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
      />
      <OrderFilterFlyout
        onQueryChanged={onQueryChanged}
        filtersRefs={searchParams.filters}
        isTDSynnex={isTDSynnex}
        filterLabels={filterLabels}
        analyticsCategories={analyticsCategories}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <OrderModificationFlyout
        store={useOrderTrackingStore}
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={gridConfig?.orderModifyLabels}
        gridConfig={gridConfig}
        userData={userData}
        isTDSynnex={isTDSynnex}
      />
      <SettingsFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={gridConfig.settingsFlyoutLabels}
        config={gridConfig}
        settings={settings}
        isTDSynnex={isTDSynnex}
      />
      <ProductReplacementFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={{
          ...gridConfig?.productReplacementFlyout,
          ...gridConfig?.orderModifyLabels,
        }}
        config={gridConfig}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={addNewItem}
        isTDSynnex={isTDSynnex}
        onQueryChanged={onQueryChanged}
      />
    </>
  );
};
export default MainGridFlyouts;
