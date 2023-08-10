import React from 'react';
import DNotesFlyout from '../DNotesFlyout/DNotesFlyout';
import ExportFlyout from '../ExportFlyout/ExportFlyout';
import InvoicesFlyout from '../InvoicesFlyout/InvoicesFlyout';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import OrderModificationFlyout from './ModificationFlyout/OrderModificationFlyout';

const Flyouts = ({
  downloadAllFile,
  openFilePdf,
  config,
  hasAIORights,
  apiResponse,
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
      <OrderModificationFlyout
        subheaderReference={document.querySelector('.subheader > div > div')}
        items={apiResponse?.content?.items}
        apiResponse={apiResponse?.content}
        labels={config.labels}
        config={config}
      />
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
    </>
  );
};
export default Flyouts;
