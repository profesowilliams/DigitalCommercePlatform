import React from 'react';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import ExportFlyout from '../ExportFlyout/ExportFlyout';
import InvoicesFlyout from '../InvoicesFlyout/InvoicesFlyout';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import OrderModificationFlyout from './ModificationFlyout/OrderModificationFlyout';
import ProductReplacementFlyout from './ReplacementFlyout/ProductReplacementFlyout';

const Flyouts = ({
  downloadAllFile,
  openFilePdf,
  config,
  hasAIORights,
  content,
  gridRef,
  rowsToGrayOutTDNameRef,
  userData,
  addNewItem,
}) => {
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  return (
    <>
      <DNotesFlyout
        store={useOrderTrackingStore}
        dNotesFlyout={config?.dNotesFlyout}
        dNoteColumnList={config?.dNoteColumnList}
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
        invoicesFlyout={config?.invoicesFlyout}
        invoicesColumnList={config?.invoicesColumnList}
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
      {content && (
        <OrderModificationFlyout
          subheaderReference={document.querySelector('.subheader > div > div')}
          content={content}
          labels={config?.orderModifyLabels}
          config={config}
          gridRef={gridRef}
          rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          userData={userData}
        />
      )}
      <ExportFlyout
        store={useOrderTrackingStore}
        componentProp={config}
        exportFlyout={config?.exportFlyout}
        exportOptionsList={config?.exportOptionsList}
        exportSecondaryOptionsList={config?.exportSecondaryOptionsList}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
        exportAnalyticsLabel={''}
      />
      <ProductReplacementFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={config.productReplacementFlyout}
        config={config}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={addNewItem}
      />
    </>
  );
};
export default Flyouts;
