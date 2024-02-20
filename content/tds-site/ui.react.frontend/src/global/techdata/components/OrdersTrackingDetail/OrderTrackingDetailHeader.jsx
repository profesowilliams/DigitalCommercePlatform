import React, { useState, useEffect } from 'react';
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
import { usGet, usPost } from '../../../../utils/api';
import OrderReleaseAlertModal from '../OrdersTrackingGrid/Modals/OrderReleaseAlertModal';
import XMLMessageModal from '../OrdersTrackingGrid/Modals/XMLMessageModal';

const OrderTrackingDetailHeader = ({
  config,
  content,
  hasAIORights,
  hasOrderModificationRights,
  openFilePdf,
  componentProps,
  userData,
}) => {
  const { saleslogin = '' } = getUrlParamsCaseInsensitive();
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openXMLAlert, setOpenXMLAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;
  const orderEditable = content?.orderEditable === true;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };

  const handleOrderModification = () => {
    orderEditable &&
      setCustomState({
        key: 'orderModificationFlyout',
        value: {
          data: null,
          id,
          show: true,
        },
      });
  };

  const labels = config?.actionLabels;

  const firstDeliveryNote = content?.deliveryNotes
    ? content?.deliveryNotes[0]
    : [];
  const isDeliveryNoteDownloadable = firstDeliveryNote?.canDownloadDocument;
  const firstInvoice = content?.invoices ? content.invoices[0] : [];
  const isInvoiceDownloadable = firstInvoice?.canDownloadDocument;

  const areDeliveryNotesAvailable =
    content?.deliveryNotes?.length > 1 ||
    (content?.deliveryNotes?.length === 1 && isDeliveryNoteDownloadable);
  const areInvoicesAvailable =
    content?.invoices?.length > 1 ||
    (content?.invoices?.length === 1 && isInvoiceDownloadable);
  const areReleaseTheOrderAvailable =
    content.shipComplete === true &&
    content.status !== 'Completed' &&
    content.orderEditable;
  const areSerialNumbersAvailable = content.serialsAny === true;
  const areXMLMessageAvailable =
    content?.xmlAvailable === true && userData?.isInternalUser;
  const isModifiable = hasOrderModificationRights && orderEditable;
  const id = content.orderNumber;
  const poNumber = content?.customerPO;
  const hasMultipleDNotes = content?.deliveryNotes?.length > 1;
  const hasMultipleInvoices = content?.invoices?.length > 1;

  const handleDownloadDNote = () => {
    if (isDeliveryNoteDownloadable) {
      openFilePdf('DNote', id, content?.deliveryNotes[0]?.id);
      pushDataLayerGoogle(getDNoteViewAnalyticsGoogle(1, 'Order Details'));
    }
  };

  const handleDownloadInvoice = () => {
    if (isInvoiceDownloadable) {
      openFilePdf('Invoice', id, content?.invoices[0]?.id);
      pushDataLayerGoogle(getInvoiceViewAnalyticsGoogle(1, 'Order Details'));
    }
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

  const triggerXMLMessage = async () => {
    const url = `${componentProps.uiCommerceServiceDomain}/v3/Order/ITOrderXML/${id}`;
    await usGet(url)
      .then((response) => {
        if (response?.status === 200) {
          let xmlWindow = window.open('', '_blank');
          xmlWindow.document.write(JSON.stringify(response));
        } else {
          setOpenXMLAlert(true);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setOpenXMLAlert(false);
        }, 5000);
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
      condition: isModifiable,
      label: labels?.actionModifyOrder,
      onClick: handleOrderModification,
    },
    {
      condition: areSerialNumbersAvailable,
      label: labels?.exportSerialNumbers,
      onClick: triggerExportFlyout,
    },
  ];

  const XMLelement = {
    condition: true,
    label: labels?.xmlMessageLabel,
    onClick: triggerXMLMessage,
  };

  areXMLMessageAvailable && menuActionsItems.push(XMLelement);

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
      OrderId: id,
    };
    const url = `${componentProps.uiCommerceServiceDomain}/v2/ChangeDeliveryFlag`;
    await usPost(url, params)
      .then((response) => {
        const {
          data: {
            content: { changeDelFlag, isError },
          },
        } = response;
        if (changeDelFlag?.isError === false && isError === false) {
          setReleaseSuccess(true);
        } else {
          setReleaseSuccess(false);
        }
      })
      .finally(() => {
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
        }, 5000);
      });
  };

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
        handleClose={() => {
          setOpenAlert(false);
        }}
        orderLineDetails={config.actionLabels}
        releaseSuccess={releaseSuccess}
      />
      <XMLMessageModal
        open={openXMLAlert}
        handleClose={() => setOpenXMLAlert(false)}
        message={labels?.xmlMessageAlertLabel}
      />
    </div>
  );
};
export default OrderTrackingDetailHeader;
