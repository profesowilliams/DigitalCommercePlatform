import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from './../../../../../utils/utils';
import MenuActions from './MenuActions';
import Title from './Title';
import Navigation from './Navigation';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { XMLMessageAnalyticsGoogle, pushDataLayerGoogle, } from '../../OrdersTrackingGrid/Utils/analyticsUtils'; // TODO!
import { usGet } from '../../../../../utils/api';
import { handleDownloadExcelExport } from '../utils/exportUtils';

const HeaderContainer = ({
  config,
  content,
  openFilePdf,
  componentProps,
  onProductChange,
  isLoading
}) => {
  const labels = config?.actionLabels;

  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const exportTranslations = uiTranslations?.['OrderTracking.Details.Export'];

  const effects = useOrderTrackingStore((state) => state.effects);
  const { hasRights, setCustomState } = effects;

  const userData = useOrderTrackingStore((state) => state.userData);
  const hasAIORights = hasRights('AIO');
  const hasOrderModificationRights = hasRights('OrderModification');

  const orderModificationFlag = useOrderTrackingStore(
    (state) => state.featureFlags.orderModification
  );

  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [isDeliveryNoteDownloadable, setIsDeliveryNoteDownloadable] = useState(false);
  const [isInvoiceDownloadable, setIsInvoiceDownloadable] = useState(false);
  const [menuActionsItems, setMenuActionsItems] = useState([]);

  const handleActionMouseOver = () => {
    console.log('HeaderContainer::handleActionMouseOver');
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    console.log('HeaderContainer::handleActionMouseLeave');
    setActionsDropdownVisible(false);
  };

  const handleDownloadDNote = () => {
    console.log('HeaderContainer::handleDownloadDNote');
    if (isDeliveryNoteDownloadable && content?.orderNumber && content?.deliveryNotes[0]?.id) {
      openFilePdf('DNote', content.orderNumber, content.deliveryNotes[0].id);
    }
  };

  const handleDownloadInvoice = () => {
    console.log('HeaderContainer::handleDownloadInvoice');
    if (isInvoiceDownloadable && content?.orderNumber && content?.invoices[0]?.id) {
      openFilePdf('Invoice', content.orderNumber, content?.invoices[0].id);
    }
  };

  const triggerOrderModificationFlyout = () => {
    console.log('HeaderContainer::triggerOrderModificationFlyout');
    content?.paymentDetails?.currency && content?.orderEditable === true && content?.orderNumber &&
      setCustomState({
        key: 'orderModificationFlyout',
        value: {
          data: null,
          id: content.orderNumber,
          show: true,
          currency: content.paymentDetails.currency,
        },
      });
  };

  const triggerDNotesFlyout = () => {
    console.log('HeaderContainer::triggerDNotesFlyout');
    content?.orderNumber && content?.customerPO && content?.deliveryNotes && setCustomState({
      key: 'dNotesFlyout',
      value: {
        data: content.deliveryNotes,
        show: true,
        id: content.orderNumber,
        reseller: content.customerPO,
      },
    });
  };

  const triggerInvoicesFlyout = () => {
    console.log('HeaderContainer::invoicesFlyout');
    content?.orderNumber && content?.customerPO && content?.invoices && setCustomState({
      key: 'invoicesFlyout',
      value: {
        data: content.invoices,
        show: true,
        id: content.orderNumber,
        reseller: content.customerPO
      },
    });
  };

  const triggerExport = () => {
    console.log('HeaderContainer::triggerExport');
    handleDownloadExcelExport({ translations: exportTranslations, config, effects });
  };

  const triggerXMLMessage = async () => {
    console.log('HeaderContainer::triggerXMLMessage');

    const url = `${componentProps.uiCommerceServiceDomain}/v3/Order/ITOrderXML/${content?.orderNumber}`;
    await usGet(url)
      .then((response) => {
        if (response?.status === 200) {
          const xmlContent = new Blob([response?.data], { type: 'text/xml' });
          const urlXML = URL.createObjectURL(xmlContent);
          window.open(urlXML, '_blank');
          URL.revokeObjectURL(urlXML);
          pushDataLayerGoogle(XMLMessageAnalyticsGoogle('success'));
        } else {
          setOpenXMLAlert(true);
          pushDataLayerGoogle(XMLMessageAnalyticsGoogle('fail'));
        }
      })
      .finally(() => {
        setTimeout(() => {
          setOpenXMLAlert(false);
        }, 5000);
      });
  };

  useEffect(async () => {
    console.log('HeaderContainer::useEffect::content');

    if (!content) return;

    const firstDeliveryNote = content.deliveryNotes ? content.deliveryNotes[0] : []
    setIsDeliveryNoteDownloadable(firstDeliveryNote?.canDownloadDocument);

    const firstInvoice = content.invoices ? content.invoices[0] : [];
    setIsInvoiceDownloadable(firstInvoice?.canDownloadDocument);

    console.log('HeaderContainer::useEffect::content::currency[' + content?.paymentDetails?.currency + ']');

    const areDeliveryNotesAvailable = content?.orderNumber && content?.deliveryNotes[0]?.id && (content.deliveryNotes?.length > 1 || (content.deliveryNotes?.length === 1 && firstDeliveryNote?.canDownloadDocument));
    const areInvoicesAvailable =
        content?.orderNumber &&
        content?.invoices[0]?.id &&
      (content.invoices?.length > 1 ||
      (content.invoices?.length === 1 &&
        firstInvoice?.canDownloadDocument));
    const isReleaseTheOrderAvailable = hasOrderModificationRights && content.shipComplete === true && content.status !== 'Completed' && content.orderEditable === true;
    const areSerialNumbersAvailable = content.serialsAny === true;
    const areXMLMessageAvailable = content.xmlAvailable === true && userData?.isInternalUser;
    const isModifiable = hasOrderModificationRights && content.orderEditable === true;
    const hasMultipleDNotes = content?.deliveryNotes?.length > 1;
    const hasMultipleInvoices = content?.invoices?.length > 1;

    console.log('HeaderContainer::useEffect::content::areDeliveryNotesAvailable[' + areDeliveryNotesAvailable + ']');
    console.log('HeaderContainer::useEffect::content::areInvoicesAvailable[' + areInvoicesAvailable + ']');
    console.log('HeaderContainer::useEffect::content::isReleaseTheOrderAvailable[' + isReleaseTheOrderAvailable + ']');
    console.log('HeaderContainer::useEffect::content::areSerialNumbersAvailable[' + areSerialNumbersAvailable + ']');
    console.log('HeaderContainer::useEffect::content::areXMLMessageAvailable[' + areXMLMessageAvailable + ']');
    console.log('HeaderContainer::useEffect::content::isModifiable[' + isModifiable + ']');
    console.log('HeaderContainer::useEffect::content::hasMultipleDNotes[' + hasMultipleDNotes + ']');
    console.log('HeaderContainer::useEffect::content::hasMultipleInvoices[' + hasMultipleInvoices + ']');

    const actionsItems = [
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
      ...(orderModificationFlag
        ? [
          {
            condition: isReleaseTheOrderAvailable,
            label: labels?.releaseTheOrder,
            onClick: () => setReleaseOrderShow(true),
          },
          {
            condition: isModifiable,
            label: labels?.actionModifyOrder,
            onClick: triggerOrderModificationFlyout,
          },
        ]
        : []),
      {
        condition: areSerialNumbersAvailable,
        label: labels?.exportSerialNumbers,
        onClick: triggerExport,
      },
    ];

    const XMLelement = {
      condition: true,
      label: labels?.xmlMessageLabel,
      onClick: triggerXMLMessage,
    };

    areXMLMessageAvailable && actionsItems.push(XMLelement);

    setMenuActionsItems(actionsItems);

  }, [content]);

  return (
    <div className="header-container">
      <div className="navigation-container">
        <Navigation
          config={config}
          content={content}
          onProductChange={onProductChange}
          isLoading={isLoading}
        />
      </div>
      <div className="title-container">
        <Title
          content={content}
          labels={config?.labels}
          isLoading={isLoading}
        />
        <div
          className="actions-container"
          onMouseOver={handleActionMouseOver}
          onMouseLeave={handleActionMouseLeave}
        >
          <span className="quote-actions">
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
  );
};

export default HeaderContainer;