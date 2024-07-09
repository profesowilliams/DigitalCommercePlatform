import React from 'react';
import DNotesFlyout from '../../OrdersTrackingCommon/Flyouts/DNotes/DNotesFlyout';
import InvoicesFlyout from '../../OrdersTrackingCommon/Flyouts/Invoices/InvoicesFlyout';
import OrderModificationFlyout from '../../OrdersTrackingDetail/ModificationFlyout/OrderModificationFlyout';
import SettingsFlyout from '../Flyouts/Settings/SettingsFlyout';
import ProductReplacementFlyout from '../../ReplacementFlyout/ProductReplacementFlyout';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

const MainGridFlyouts = ({
  gridConfig,
  openFilePdf,
  downloadFileBlob,
  onQueryChanged,
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
      <OrderModificationFlyout
        store={useOrderTrackingStore}
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={gridConfig?.orderModifyLabels}
        gridConfig={gridConfig}
        isTDSynnex={isTDSynnex}
        onQueryChanged={onQueryChanged}
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
