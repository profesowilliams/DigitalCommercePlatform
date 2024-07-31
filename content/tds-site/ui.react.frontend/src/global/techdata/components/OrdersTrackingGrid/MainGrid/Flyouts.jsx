import React from 'react';
import DNotesFlyout from '../../OrdersTrackingCommon/Flyouts/DNotes/DNotesFlyout';
import InvoicesFlyout from '../../OrdersTrackingCommon/Flyouts/Invoices/InvoicesFlyout';
import OrderModificationFlyout from '../../OrdersTrackingCommon/Flyouts/OrderModification/OrderModificationFlyout';
import SettingsFlyout from '../Flyouts/Settings/SettingsFlyout';
import ProductReplacementFlyout from '../../OrdersTrackingCommon/Flyouts/ProductReplacement/ProductReplacementFlyout';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import Toaster from '../../Widgets/Toaster';

const Flyouts = ({
  gridConfig,
  openFilePdf,
  downloadAllFile,
  onQueryChanged,
  settings,
  rowsToGrayOutTDNameRef,
  addNewItem,
}) => {
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  const { closeAndCleanToaster } = useOrderTrackingStore((st) => st.effects);

  const onCloseToaster = () => {
    closeAndCleanToaster();
  };

  return (
    <>
      <DNotesFlyout
        store={useOrderTrackingStore}
        gridConfig={gridConfig}
        dNotesFlyout={gridConfig.dNotesFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        downloadAllFile={downloadAllFile}
        openFilePdf={openFilePdf}
      />
      <InvoicesFlyout
        store={useOrderTrackingStore}
        gridConfig={gridConfig}
        invoicesFlyout={gridConfig.invoicesFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        downloadAllFile={downloadAllFile}
        openFilePdf={openFilePdf}
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
      <Toaster
        classname="toaster-modal-otg"
        onClose={onCloseToaster}
        closeEnabled
        store={useOrderTrackingStore}
        message={{
          successSubmission: 'successSubmission',
          failedSubmission: 'failedSubmission',
        }}
      />
    </>
  );
};

export default Flyouts;