import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from './../../../../../utils/utils';
import MenuActions from './MenuActions';
import Title from './Title';
import Navigation from './Navigation';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { XMLMessageAnalyticsGoogle, pushDataLayerGoogle, } from '../../OrdersTrackingGrid/utils/analyticsUtils'; // TODO!
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
  const [currency, setCurrency] = useState(null);
  const [orderEditable, setOrderEditable] = useState(false);
  const [isDeliveryNoteDownloadable, setIsDeliveryNoteDownloadable] = useState(false);
  const [isInvoiceDownloadable, setIsInvoiceDownloadable] = useState(false);
  const [menuActionsItems, setMenuActionsItems] = useState([]);

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };

  const handleDownloadDNote = () => {
    if (isDeliveryNoteDownloadable) {
      openFilePdf('DNote', id, content?.deliveryNotes[0]?.id);
    }
  };

  const handleDownloadInvoice = () => {
    if (isInvoiceDownloadable) {
      openFilePdf('Invoice', id, content?.invoices[0]?.id);
    }
  };

  const triggerOrderModificationFlyout = () => {
    currency && orderEditable &&
      setCustomState({
        key: 'orderModificationFlyout',
        value: {
          data: null,
          id,
          show: true,
          currency,
        },
      });
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
  };

  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: content?.invoices, show: true, id, reseller: poNumber },
    });
  };

  const triggerExport = () => {
    handleDownloadExcelExport({ translations: exportTranslations, config, effects });
  };

  const triggerXMLMessage = async () => {
    const url = `${componentProps.uiCommerceServiceDomain}/v3/Order/ITOrderXML/${id}`;
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

    setOrderEditable(content.orderEditable === true);

    const firstDeliveryNote = content.deliveryNotes ? content.deliveryNotes[0] : []
    setIsDeliveryNoteDownloadable(firstDeliveryNote?.canDownloadDocument);

    const firstInvoice = content.invoices ? content.invoices[0] : [];
    setIsInvoiceDownloadable(firstInvoice?.canDownloadDocument);

    console.log('HeaderContainer::useEffect::content::currency[' + content?.paymentDetails?.currency + ']');
    setCurrency(content?.paymentDetails?.currency);

    const areDeliveryNotesAvailable = content.deliveryNotes?.length > 1 || (content.deliveryNotes?.length === 1 && firstDeliveryNote?.canDownloadDocument);
    const areInvoicesAvailable = content.invoices?.length > 1 || (content.invoices?.length === 1 && firstInvoice?.canDownloadDocument);
    const isReleaseTheOrderAvailable = hasOrderModificationRights && content.shipComplete === true && content.status !== 'Completed' && content.orderEditable;
    const areSerialNumbersAvailable = content.serialsAny === true;
    const areXMLMessageAvailable = content.xmlAvailable === true && userData?.isInternalUser;
    const isModifiable = hasOrderModificationRights && orderEditable;
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