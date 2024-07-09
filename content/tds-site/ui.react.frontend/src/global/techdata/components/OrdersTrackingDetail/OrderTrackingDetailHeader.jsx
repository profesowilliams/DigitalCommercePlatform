import React, { useState, useEffect } from 'react';
import Link from './../Widgets/Link';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import MenuActions from './Header/MenuActions';
import OrderTrackingDetailTitle from './Header/OrderTrackingDetailTitle';
import { useOrderTrackingStore } from '../OrdersTrackingCommon/Store/OrderTrackingStore';
import {
  XMLMessageAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../OrdersTrackingGrid/utils/analyticsUtils';
//import { getLocalStorageData } from '../OrdersTrackingGrid/utils/gridUtils';
import SoldToCard from './Header/SoldToCard';
import OrderAcknowledgementCard from './Header/OrderAcknowledgementCard';
import ContactCard from './Header/ContactCard';
import { getUrlParamsCaseInsensitive } from '../../../../utils';
//import {
//  ORDER_PAGINATION_LOCAL_STORAGE_KEY,
//  ORDER_SEARCH_LOCAL_STORAGE_KEY,
//  ORDER_FILTER_LOCAL_STORAGE_KEY,
//  REPORTS_LOCAL_STORAGE_KEY,
//} from '../../../../utils/constants';
import OrderReleaseModal from '../OrdersTrackingGrid/Modals/OrderReleaseModal';
import { usGet, usPost } from '../../../../utils/api';
import OrderReleaseAlertModal from '../OrdersTrackingGrid/Modals/OrderReleaseAlertModal';
import XMLMessageModal from '../OrdersTrackingGrid/Modals/XMLMessageModal';
import MigrationInfoBox from '../MigrationInfoBox/MigrationInfoBox';
import { ArrowLeftIcon } from '../../../../fluentIcons/FluentIcons';
import { handleDownloadExcelExport } from './utils/orderTrackingExportUtils';
import { fetchOrderDetailsData } from './OrdersTrackingDetailGrid/utils/orderTrackingUtils';

const OrderTrackingDetailHeader = ({
  config,
  content,
  hasAIORights,
  hasOrderModificationRights,
  openFilePdf,
  componentProps,
  userData,
  setOrderModifyHeaderInfo,
}) => {
  const params = getUrlParamsCaseInsensitive();
  const saleslogin = params.get('saleslogin');
  const queryCacheKeyParam = params.get('q');

  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openXMLAlert, setOpenXMLAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [previousOrder, setPreviousOrder] = useState(null);
  const [nextOrder, setNextOrder] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [backButton, setBackButton] = useState(null);
  const [currency, setCurrency] = useState(null);
  const effects = useOrderTrackingStore((state) => state.effects);
  const orderModificationFlag = useOrderTrackingStore(
    (state) => state.featureFlags.orderModification
  );
  const { setCustomState, setFeatureFlags } = effects;
  const orderEditable = content?.orderEditable === true;
  const infoBoxEnable = content?.sapOrderMigration?.referenceType?.length > 0;
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const detailsTranslations = uiTranslations?.['OrderTracking.Details'];
  const exportTranslations = uiTranslations?.['OrderTracking.MainGrid.Export'];

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
  const isReleaseTheOrderAvailable =
    hasOrderModificationRights &&
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

  areXMLMessageAvailable && menuActionsItems.push(XMLelement);

  const createBackUrl = (data) => {
    console.log('OrderTrackingDetailHeader::createBackUrl');

    const url = new URL(location.href.substring(0, location.href.lastIndexOf('/')) + '.html');
    if (saleslogin) url.searchParams.set('saleslogin', saleslogin);

    if (data?.criteria) {
      url.searchParams.set('sortby', data.criteria.sortBy.toLowerCase());
      url.searchParams.set('sortdirection', data.criteria.sortAscending ? 'asc' : 'desc');
      url.searchParams.set('page', data.criteria.pageNumber);

      if (data.criteria?.createdFrom && data.criteria?.createdTo) {
        url.searchParams.set('datetype', 'orderDate');
        url.searchParams.set('datefrom', data.criteria?.createdFrom);
        url.searchParams.set('dateto', data.criteria?.createdTo);
      }

      if (data.criteria?.shippedDateFrom && data.criteria?.shippedDateTo) {
        url.searchParams.set('datetype', 'shipDate');
        url.searchParams.set('datefrom', data.criteria?.shippedDateFrom);
        url.searchParams.set('dateto', data.criteria?.shippedDateTo);
      }

      if (data.criteria?.invoiceDateFrom && data.criteria?.invoiceDateTo) {
        url.searchParams.set('datetype', 'invoiceDate');
        url.searchParams.set('datefrom', data.criteria?.invoiceDateFrom);
        url.searchParams.set('dateto', data.criteria?.invoiceDateTo);
      }

      if (data.criteria?.etaDateFrom && data.criteria?.etaDateTo) {
        url.searchParams.set('datetype', 'etaDate');
        url.searchParams.set('datefrom', data.criteria?.etaDateFrom);
        url.searchParams.set('dateto', data.criteria?.etaDateTo);
      }

      if (data.criteria?.type) {
        data.criteria.type.forEach(type => {
          url.searchParams.append('type', type);
        });
      }

      if (data.criteria?.status) {
        data.criteria.status.forEach(status => {
          url.searchParams.append('status', status);
        });
      }

      if (data.criteria?.freetextSearch) {
        url.searchParams.append('value', data.criteria.freetextSearch);
      }

      if (data.criteria?.freetextSearchKey) {
        url.searchParams.append('field', data.criteria.freetextSearchKey);
      }

      if (data.criteria?.gtmfield) {
        url.searchParams.append('gtmfield', data.criteria.gtmfield);
      }

      if (data.criteria?.reportName) {
        url.searchParams.append('report', data.criteria.reportName);
      }
    }

    return url.toString();
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

  const fetchFiltersRefinements = async () => {
    const results = await usGet(
      `${componentProps.uiCommerceServiceDomain}/v3/refinements`
    );
    return results.data.content;
  };

  const fetchNavigationData = async () => {
    try {
      if (!queryCacheKeyParam || !id) return null;
      const results = await usGet(
        `${componentProps.uiCommerceServiceDomain}/v3/cache/${queryCacheKeyParam}/order/${id}`
      );
      return results.data.content;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchCriteriaData = async () => {
    try {
      if (!queryCacheKeyParam) return null;
      const results = await usGet(
        `${componentProps.uiCommerceServiceDomain}/v3/cache/${queryCacheKeyParam}/criteria`
      );
      return results.data.content;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const renderBackButton = (criteria) => {
    const isSearchActive = criteria?.freetextSearch || criteria?.freetextSearchKey;
    const areFiltersActive = criteria?.type || criteria?.status;
    const areReportsActive = criteria?.reportName;

    return isSearchActive || areFiltersActive || areReportsActive
      ? detailsTranslations?.Button_BackToSearchResults || 'Search Results'
      : detailsTranslations?.Button_BackToAll || 'All orders';
  };

  const renderRightSideOfNavigation = () => {
    return (
      <div className="navigation-container--right">
        {previousOrder && (
          <Link
            variant="previous"
            href={window.location.href.replace(id, previousOrder)}
            underline="underline-none"
          >
            <i className="fas fa-chevron-left"></i>
            {detailsTranslations?.Button_Prev || 'Previous order'}
          </Link>
        )}
        {nextOrder && (
          <Link
            variant="next"
            href={window.location.href.replace(id, nextOrder)}
            underline="underline-none"
          >
            {detailsTranslations?.Button_Next || 'Next order'}
            <i className="fas fa-chevron-right"></i>
          </Link>
        )}
      </div>
    );
  };

  useEffect(async () => {
    const refinements = await fetchFiltersRefinements();
    setFeatureFlags(refinements?.featureFlags);

    const response = await fetchOrderDetailsData(config);
    setCurrency(response?.data?.content?.paymentDetails?.currency);
    const navigationData = queryCacheKeyParam && (await fetchNavigationData());
    if (navigationData) {
      setPreviousOrder(navigationData.prevOrder || null);
      setNextOrder(navigationData.nextOrder || null);
    }

    const criteriaData = queryCacheKeyParam && (await fetchCriteriaData());
    setBackUrl(createBackUrl(criteriaData));
    setBackButton(renderBackButton(criteriaData));
  }, []);

  return (
    currency && (
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
            {renderRightSideOfNavigation()}
          </div>
          <div className="title-container">
            <OrderTrackingDetailTitle
              content={content}
              labels={config?.labels}
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
          />
        )}
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
    )
  );
};
export default OrderTrackingDetailHeader;
