import React, { useState, useEffect } from 'react';
import Link from './../Widgets/Link';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import MenuActions from './Header/MenuActions';
import OrderTrackingDetailTitle from './Header/OrderTrackingDetailTitle';
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import { XMLMessageAnalyticsGoogle, pushDataLayerGoogle, } from '../OrdersTrackingGrid/utils/analyticsUtils';
import SoldToCard from './Header/SoldToCard';
import OrderAcknowledgementCard from './Header/OrderAcknowledgementCard';
import ContactCard from './Header/ContactCard';
import { getUrlParamsCaseInsensitive } from '../../../../utils';
import OrderReleaseModal from '../OrdersTrackingGrid/Modals/OrderReleaseModal';
import { usGet, usPost } from '../../../../utils/api';
import OrderReleaseAlertModal from '../OrdersTrackingGrid/Modals/OrderReleaseAlertModal';
import XMLMessageModal from '../OrdersTrackingGrid/Modals/XMLMessageModal';
import MigrationInfoBox from '../MigrationInfoBox/MigrationInfoBox';
import { ArrowLeftIcon } from '../../../../fluentIcons/FluentIcons';
import { handleDownloadExcelExport } from './utils/exportUtils';
import { fetchCriteriaData, fetchNavigationData, fetchFiltersRefinements } from './utils/fetchUtils';
import { renderBackButton, createBackUrl } from './utils/utils';

const OrderTrackingDetailHeader = ({
  config,
  content,
  hasAIORights,
  hasOrderModificationRights,
  openFilePdf,
  componentProps,
  setOrderModifyHeaderInfo,
  onProductChange,
  isLoading
}) => {
  const params = getUrlParamsCaseInsensitive();
  const saleslogin = params.get('saleslogin');
  const queryCacheKeyParam = params.get('q');

  const userData = useOrderTrackingStore((state) => state.userData);

  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const detailsTranslations = uiTranslations?.['OrderTracking.Details'];
  const exportTranslations = uiTranslations?.['OrderTracking.Details.Export'];

  const labels = config?.actionLabels;

  const effects = useOrderTrackingStore((state) => state.effects);
  const orderModificationFlag = useOrderTrackingStore(
    (state) => state.featureFlags.orderModification
  );
  const { setCustomState, setFeatureFlags } = effects;

  const [backButton, setBackButton] = useState(null);
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openXMLAlert, setOpenXMLAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [previousOrder, setPreviousOrder] = useState(null);
  const [nextOrder, setNextOrder] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [orderEditable, setOrderEditable] = useState(false);
  const [infoBoxEnable, setInfoBoxEnable] = useState(false);
  const [isDeliveryNoteDownloadable, setIsDeliveryNoteDownloadable] = useState(false);
  const [isInvoiceDownloadable, setIsInvoiceDownloadable] = useState(false);
  const [menuActionsItems, setMenuActionsItems] = useState([]);
  const [poNumber, setPoNumber] = useState('');
  const [id, setId] = useState('');

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };

  const handleOrderModification = () => {
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
        setOrderModifyHeaderInfo(true);
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
        }, 5000);
      });
  };

  const handleClick = (e, id) => {
    console.log('OrderTrackingDetailHeader::handleClick');
    e.preventDefault();
    onProductChange(id);
  };

  const renderRightSideOfNavigation = () => {
    return (
      <div className="navigation-container--right">
        {previousOrder && (
          <a
            href={window.location.href.replace(id, previousOrder)}
            className="tdr-link previous underline-none"
            onClick={(e) => handleClick(e, previousOrder)}
          >
            <i className="fas fa-chevron-left"></i>
            {detailsTranslations?.Button_Prev || 'Previous order'}
          </a>
        )}
        {nextOrder && (
          <a
            href={window.location.href.replace(id, nextOrder)}
            className="tdr-link next underline-none"
            onClick={(e) => handleClick(e, nextOrder)}
          >
            {detailsTranslations?.Button_Next || 'Next order'}
            <i className="fas fa-chevron-right"></i>
          </a>
        )}
      </div>
    );
  };

  useEffect(async () => {
    console.log('OrderTrackingDetailHeader::useEffect');

    const refinements = await fetchFiltersRefinements(config);
    setFeatureFlags(refinements?.featureFlags);
  }, []);

  useEffect(async () => {
    console.log('OrderTrackingDetailHeader::useEffect::content');

    if (!content) return;

    setOrderEditable(content.orderEditable === true);
    setInfoBoxEnable(content.sapOrderMigration?.referenceType?.length > 0);
    setPoNumber(content.customerPO);
    setId(content.orderNumber);

    const firstDeliveryNote = content.deliveryNotes ? content.deliveryNotes[0] : []
    setIsDeliveryNoteDownloadable(firstDeliveryNote?.canDownloadDocument);

    const firstInvoice = content.invoices ? content.invoices[0] : [];
    setIsInvoiceDownloadable(firstInvoice?.canDownloadDocument);

    console.log('OrderTrackingDetailHeader::useEffect::content::currency[' + content?.paymentDetails?.currency + ']');
    setCurrency(content?.paymentDetails?.currency);

    const navigationData = queryCacheKeyParam && (await fetchNavigationData(config, queryCacheKeyParam, content.orderNumber));
    setPreviousOrder(navigationData?.prevOrder);
    setNextOrder(navigationData?.nextOrder);

    const criteriaData = queryCacheKeyParam && (await fetchCriteriaData(config, queryCacheKeyParam, content.orderNumber));
    setBackUrl(createBackUrl(saleslogin, criteriaData));
    setBackButton(renderBackButton(detailsTranslations, criteriaData));

    const areDeliveryNotesAvailable = content.deliveryNotes?.length > 1 || (content.deliveryNotes?.length === 1 && firstDeliveryNote?.canDownloadDocument);
    const areInvoicesAvailable = content.invoices?.length > 1 || (content.invoices?.length === 1 && firstInvoice?.canDownloadDocument);
    const isReleaseTheOrderAvailable = hasOrderModificationRights && content.shipComplete === true && content.status !== 'Completed' && content.orderEditable;
    const areSerialNumbersAvailable = content.serialsAny === true;
    const areXMLMessageAvailable = content.xmlAvailable === true && userData?.isInternalUser;
    const isModifiable = hasOrderModificationRights && orderEditable;
    const hasMultipleDNotes = content?.deliveryNotes?.length > 1;
    const hasMultipleInvoices = content?.invoices?.length > 1;

    console.log('OrderTrackingDetailHeader::useEffect::content::areDeliveryNotesAvailable[' + areDeliveryNotesAvailable + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::areInvoicesAvailable[' + areInvoicesAvailable + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::isReleaseTheOrderAvailable[' + isReleaseTheOrderAvailable + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::areSerialNumbersAvailable[' + areSerialNumbersAvailable + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::areXMLMessageAvailable[' + areXMLMessageAvailable + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::isModifiable[' + isModifiable + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::hasMultipleDNotes[' + hasMultipleDNotes + ']');
    console.log('OrderTrackingDetailHeader::useEffect::content::hasMultipleInvoices[' + hasMultipleInvoices + ']');

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
            onClick: handleOrderModification,
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
    <div className="cmp-orders-qp__config-grid">
      <div className="header-container">
        <div className="navigation-container">
          {backUrl && (<Link
            variant="back-to-orders"
            href={backUrl}
            underline="underline-none"
          >
            <ArrowLeftIcon className="arrow-left" />
            {backButton}
          </Link>)}
          {!isLoading && renderRightSideOfNavigation()}
        </div>
        <div className="title-container">
          <OrderTrackingDetailTitle
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
      {infoBoxEnable && (
        <MigrationInfoBox
          config={config?.labels}
          id={content?.sapOrderMigration?.id}
          referenceType={content?.sapOrderMigration?.referenceType}
          isLoading={isLoading}
        />
      )}
      <div className="info-container">
        <SoldToCard
          content={content}
          isLoading={isLoading}
        />
        <OrderAcknowledgementCard
          content={content}
          isLoading={isLoading}
        />
        <ContactCard
          content={content}
          isLoading={isLoading}
        />
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