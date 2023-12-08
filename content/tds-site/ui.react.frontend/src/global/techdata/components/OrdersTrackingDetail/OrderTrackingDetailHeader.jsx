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
import { getLocalStorageData } from '../OrdersTrackingGrid/utils/gridUtils';
import SoldToCard from './Header/SoldToCard';
import OrderAcknowledgementCard from './Header/OrderAcknowledgementCard';
import ContactCard from './Header/ContactCard';
import { getUrlParamsCaseInsensitive } from '../../../../utils';
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from '../../../../utils/constants';
import OrderReleaseModal from '../OrdersTrackingGrid/Modals/OrderReleaseModal';
import { usPost } from '../../../../utils/api';
import OrderReleaseAlertModal from '../OrdersTrackingGrid/Modals/OrderReleaseAlertModal';

const OrderTrackingDetailHeader = ({
  config,
  content,
  hasAIORights,
  hasOrderModificationRights,
  openFilePdf,
  componentProps,
}) => {
  const { saleslogin = '' } = getUrlParamsCaseInsensitive();
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
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
      value: {
        data: {},
        id,
        show: true
      },
    });
  };

  const labels = config?.actionLabels;

  const areDeliveryNotesAvailable = content?.deliveryNotes?.length > 0;
  const areInvoicesAvailable = content?.invoices?.length > 0;
  const areReleaseTheOrderAvailable = content.shipComplete === true;
  const areSerialNumbersAvailable = content.serialsAny === true;
  const id = content.orderNumber;
  const poNumber = content.customerPO;
  const hasMultipleDNotes = content?.deliveryNotes?.length > 1;
  const hasMultipleInvoices = content?.invoices?.length > 1;

  const handleDownloadDNote = () => {
    openFilePdf('DNote', id, content?.deliveryNotes[0]?.id);
    pushDataLayerGoogle(getDNoteViewAnalyticsGoogle(1, 'Order Details'));
  };

  const handleDownloadInvoice = () => {
    openFilePdf('Invoice', id, content?.invoices[0]?.id);
    pushDataLayerGoogle(getInvoiceViewAnalyticsGoogle(1, 'Order Details'));
  };

  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: {
        data: content?.deliveryNotes,
        show: true,
        id,
        reseller: poNumber,
      },
    });
    pushDataLayerGoogle(
      getDNoteViewAnalyticsGoogle(
        content?.deliveryNotes?.length,
        'Order Details'
      )
    );
  };

  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: content?.invoices, show: true, id, reseller: poNumber },
    });
    pushDataLayerGoogle(
      getInvoiceViewAnalyticsGoogle(content?.invoices?.length, 'Order Details')
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
      label: labels?.viewDNotes,
      onClick: hasMultipleDNotes ? triggerDNotesFlyout : handleDownloadDNote,
    },
    {
      condition: hasAIORights && areInvoicesAvailable,
      label: labels?.viewInvoices,
      onClick: hasMultipleInvoices
        ? triggerInvoicesFlyout
        : handleDownloadInvoice,
    },
    {
      condition: areReleaseTheOrderAvailable,
      label: labels?.releaseTheOrder,
      onClick: () => setReleaseOrderShow(true),
    },
    {
      condition: hasOrderModificationRights,
      label: labels?.actionModifyOrder,
      onClick: handleOrderModification,
    },
    {
      condition: areSerialNumbersAvailable,
      label: labels?.exportSerialNumbers,
      onClick: triggerExportFlyout,
    },
  ];

  const createBackUrl = () => {
    const backParams = new URLSearchParams();
    backParams.set('redirectedFrom', 'detailsPage');
    backParams.set(
      'page',
      getLocalStorageData(ORDER_PAGINATION_LOCAL_STORAGE_KEY)?.pageNumber || 1
    );
    if (saleslogin) backParams.set('saleslogin', saleslogin);
    return (
      location.href.substring(0, location.href.lastIndexOf('/')) +
      '.html?' +
      backParams.toString()
    );
  };

  const handleReleaseOrder = async () => {
    setReleaseOrderShow(false);
    const params = {
      OrderId: id
    }
      const url = `${componentProps.uiCommerceServiceDomain}/v3/orders/ChangeDeliveryFlag`;
      const {content} = await usPost(url, params);
      const {ChangeDelFlag} = content;
      const {success} = ChangeDelFlag;
      if(success){
        setReleaseSuccess(true);
      }else{
        setReleaseSuccess(false);
      }
      setOpenAlert(true);
  }

  return (
    <div className="cmp-orders-qp__config-grid">
      <div className="header-container">
        <div className="navigation-container">
          <Link
            variant="back-to-orders"
            href={createBackUrl()}
            underline="underline-none"
          >
            <i className="fas fa-chevron-left"></i>
            {getDictionaryValueOrKey(config?.labels?.back)}
          </Link>
        </div>
        <div className="title-container">
          <OrderTrackingDetailTitle content={content} labels={config?.labels} />
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
              {getDictionaryValueOrKey(config.labels?.actions)}
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
        <SoldToCard shipTo={content.shipTo} config={config} />
        <OrderAcknowledgementCard content={content} config={config} />
        <ContactCard content={content} config={config} />
      </div>
      <OrderReleaseModal
        open={releaseOrderShow}
        handleClose={() => setReleaseOrderShow(false)}
        handleReleaseOrder={handleReleaseOrder}
        orderLineDetails={config.actionLabels}
        orderNo={id}
        PONo={poNumber}
      />
      <OrderReleaseAlertModal 
        open={openAlert}
        handleClose={()=>{setOpenAlert(false)}}
        orderLineDetails={config.actionLabels}
        releaseSuccess={releaseSuccess}
      />
    </div>
  );
};
export default OrderTrackingDetailHeader;
