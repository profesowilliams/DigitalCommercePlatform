import React from 'react';
import TrackingFlyout from './TrackingFlyout/TrackingFlyout';
import ReturnFlyout from './ReturnFlyout/ReturnFlyout';
import DNotesFlyout from '../OrdersTrackingCommon/Flyouts/DNotes/DNotesFlyout';
import InvoicesFlyout from '../OrdersTrackingCommon/Flyouts/Invoices/InvoicesFlyout';
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
  isLoading
}) => {
  return (<>
    {!isLoading && content && (<>
      <TrackingFlyout
        config={config}
        trackingFlyout={config?.trackingFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <ReturnFlyout
        returnFlyout={config?.returnFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
      />
      <DNotesFlyout
        gridConfig={config}
        dNotesFlyout={config?.dNotesFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
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
        subheaderReference={document.querySelector('.subheader > div > div')}
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
      />
    </>)}
  </>);
};

export default Flyouts;