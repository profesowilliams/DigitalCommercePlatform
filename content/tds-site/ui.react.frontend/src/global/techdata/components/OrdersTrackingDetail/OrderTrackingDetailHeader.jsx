import React, { useState } from 'react';
import Link from './../Widgets/Link';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import MenuActions from './Header/MenuActions';
import OrderTrackingDetailTitle from './Header/OrderTrackingDetailTitle';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import {
  getDNoteViewAnalyticsGoogle,
  getInvoiceViewAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../OrdersTrackingGrid/utils/analyticsUtils';
import SoldToCard from './Header/SoldToCard';
import OrderAcknowledgementCard from './Header/OrderAcknowledgementCard';
import ContactCard from './Header/ContactCard';

const OrderTrackingDetailHeader = ({
  config,
  apiResponse,
  hasAIORights,
  hasOrderModificationRights,
  openFilePdf,
}) => {
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };

  const handleOrderModification = () => {
    setCustomState({
      key: 'orderModificationFlyout',
      value: { data: {}, show: true },
    });
  };

  const items = apiResponse?.content?.items || [];
  const labels = config?.labels;

  let deliveryNotes = [];
  items.map((item) => {
    deliveryNotes = deliveryNotes.concat(item.deliveryNotes);
  });
  let invoices = [];
  items.map((item) => {
    invoices = invoices.concat(item.invoices);
  });

  const areDeliveryNotesAvailable = deliveryNotes.length > 0;
  const areInvoicesAvailable = invoices.length > 0;
  const areSerialNumbersAvailable = items.some(
    (item) => item.serials.length > 0
  );

  const id = apiResponse?.content?.orderNumber;
  const poNumber = apiResponse?.content?.poNumber;
  const hasMultipleDNotes = deliveryNotes.length > 1;
  const hasMultipleInvoices = invoices.length > 1;
  const handleDownloadDNote = () => {
    openFilePdf('DNote', id, deliveryNotes[0]?.id);
  };
  const handleDownloadInvoice = () => {
    openFilePdf('Invoice', id, invoices[0]?.id);
  };
  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: { data: deliveryNotes, show: true, id, reseller: poNumber },
    });
    pushDataLayerGoogle(
      getDNoteViewAnalyticsGoogle(deliveryNotes.length, 'Order Details')
    );
  };
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id, reseller: poNumber },
    });
    pushDataLayerGoogle(
      getInvoiceViewAnalyticsGoogle(invoices.length, 'Order Details')
    );
  };
  const triggerExportFlyout = () => {
    setCustomState({
      key: 'exportFlyout',
      value: { data: config.exportFlyout, show: true, id },
    });
  };
  const menuActionsItems = [
    {
      condition: areDeliveryNotesAvailable,
      label: labels?.detailsActionViewDNotes,
      onClick: hasMultipleDNotes ? triggerDNotesFlyout : handleDownloadDNote,
    },
    {
      condition: hasAIORights && areInvoicesAvailable,
      label: labels?.detailsActionViewInvoices,
      onClick: hasMultipleInvoices
        ? triggerInvoicesFlyout
        : handleDownloadInvoice,
    },
    {
      condition: hasOrderModificationRights,
      label: labels?.detailsActionModifyOrder,
      onClick: handleOrderModification,
    },
    {
      condition: areSerialNumbersAvailable,
      label: labels?.detailsActionExportSerialNumbers,
      onClick: triggerExportFlyout,
    },
  ];

  return (
    <div className="cmp-orders-qp__config-grid">
      <div className="header-container">
        <div className="navigation-container">
          <Link
            variant="back-to-orders"
            href={`${location.href.substring(
              0,
              location.href.lastIndexOf('/')
            )}.html`}
            underline="underline-none"
          >
            <i className="fas fa-chevron-left"></i>
            {getDictionaryValueOrKey(config?.labels?.detailsBack)}
          </Link>
        </div>
        <div className="title-container">
          {apiResponse?.content && (
            <OrderTrackingDetailTitle
              content={apiResponse.content}
              label={config.labels?.detailsOrderNo}
            />
          )}
          <div
            className="actions-container"
            onMouseOver={handleActionMouseOver}
            onMouseLeave={handleActionMouseLeave}
          >
            <span
              className="quote-actions"
              onMouseOver={handleActionMouseOver}
              onMouseLeave={handleActionMouseLeave}
            >
              {getDictionaryValueOrKey(config.labels?.detailsActions)}
            </span>
            {actionsDropdownVisible && (
              <div className="actions-dropdown">
                <MenuActions items={menuActionsItems} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="info-container">
        <SoldToCard shipTo={apiResponse?.content?.shipTo} config={config} />
        <OrderAcknowledgementCard
          content={apiResponse?.content}
          config={config}
        />
        <ContactCard content={apiResponse?.content} config={config} />
      </div>
    </div>
  );
};
export default OrderTrackingDetailHeader;
