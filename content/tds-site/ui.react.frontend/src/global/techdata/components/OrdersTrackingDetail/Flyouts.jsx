import React from 'react';
import TrackingFlyout from './TrackingFlyout/TrackingFlyout';
import ReturnFlyout from './ReturnFlyout/ReturnFlyout';
import DNotesFlyout from '../OrdersTrackingCommon/Flyouts/DNotes/DNotesFlyout';
import InvoicesFlyout from '../OrdersTrackingCommon/Flyouts/Invoices/InvoicesFlyout';
import OrderModificationFlyout from '../OrdersTrackingCommon/Flyouts/OrderModification/OrderModificationFlyout';
import ProductReplacementFlyout from '../OrdersTrackingCommon/Flyouts/ProductReplacement/ProductReplacementFlyout';

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
        downloadAllFile={downloadAllFile}
        openFilePdf={openFilePdf}
      />
      <InvoicesFlyout
        gridConfig={config}
        invoicesFlyout={config?.invoicesFlyout}
        subheaderReference={document.querySelector('.subheader > div > div')}
        downloadAllFile={downloadAllFile}
        openFilePdf={openFilePdf}
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