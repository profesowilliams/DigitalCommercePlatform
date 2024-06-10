import React from 'react';
import TrackingFlyout from './TrackingFlyout/TrackingFlyout';
import ReturnFlyout from './ReturnFlyout/ReturnFlyout';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import InvoicesFlyout from '../InvoicesFlyout/InvoicesFlyout';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import OrderModificationFlyout from './ModificationFlyout/OrderModificationFlyout';
import ProductReplacementFlyout from '../ReplacementFlyout/ProductReplacementFlyout';

const Flyouts = ({
  downloadAllFile,
  openFilePdf,
  config,
  content,
  gridRef,
  rowsToGrayOutTDNameRef,
  addNewItem,
  setOrderModifyHeaderInfo,
}) => {
  const isTDSynnex = useOrderTrackingStore((st) => st.isTDSynnex);
  return (
    <>
      <TrackingFlyout
        config={config}
        trackingFlyout={config?.trackingFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
      />
      <ReturnFlyout
        returnFlyout={config?.returnFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        isTDSynnex={isTDSynnex}
      />
      <DNotesFlyout
        gridConfig={config}
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
        gridConfig={config}
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
      />
      <OrderModificationFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={config?.orderModifyLabels}
        gridConfig={config}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        content={content}
        setOrderModifyHeaderInfo={setOrderModifyHeaderInfo}
        isTDSynnex={isTDSynnex}
      />
      <ProductReplacementFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        labels={{
          ...config?.productReplacementFlyout,
          ...config?.orderModifyLabels,
        }}
        config={config}
        gridRef={gridRef}
        rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
        addNewItem={addNewItem}
        setOrderModifyHeaderInfo={setOrderModifyHeaderInfo}
        isTDSynnex={isTDSynnex}
      />
    </>
  );
};
export default Flyouts;
