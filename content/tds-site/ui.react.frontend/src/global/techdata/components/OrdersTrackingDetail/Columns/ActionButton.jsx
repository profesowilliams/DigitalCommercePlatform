import React, { useEffect, useState } from 'react';
import { EllipsisIcon } from '../../../../../fluentIcons/FluentIcons';
import MenuActions from '../Header/MenuActions';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { usGet } from '../../../../../utils/api';

const ActionsButton = ({
  line,
  element,
  index,
  config = {},
  openFilePdf,
  apiResponse,
  hasAIORights,
}) => {
  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  const disabledIconStyle = {
    ...iconStyle,
    fill: '#727679',
    cursor: 'default',
  };
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const multiple = line?.lineDetails?.length > 1;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;
  const isSingleElement = !multiple;

  const isShipment = element?.isShipment === true;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };
  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };
  const effects = useOrderTrackingStore((st) => st.effects);
  const { setCustomState } = effects;
  const labels = config?.actionLabels;
  const invoices = line.invoices;
  const deliveryNotes = line.deliveryNotes;
  const trackAndTraceAvailable = deliveryNotes.length > 0;
  const areDeliveryNotesAvailable = deliveryNotes.length > 0;
  const areInvoicesAvailable = invoices.length > 0;
  const isSerialNumberAvailable = line.serials.length > 0;
  // TODO: Change isReturnAvailable validatioon after flyout for multiple return links will be created
  const invoicesWithReturnURL = invoices.filter(
    (invoice) => invoice.returnURL && invoice.returnURL.length > 0
  );
  const isReturnAvailable =
    invoices.length > 0 && invoicesWithReturnURL.length === 1;

  const id = apiResponse?.orderNumber;
  const poNumber = apiResponse?.customerPO;

  const orderId = id;
  const lineId = line.line;
  const dNoteId = deliveryNotes[0].id;
  const enableLineId = line.line.length === 1;

  const toaster = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      config?.actionLabels?.toasterCopySerialNumbersMessage
    ),
  };

  const hasMultipleDNotes = deliveryNotes.length > 1;
  const hasMultipleInvoices = invoices.length > 1;
  const hasMultipleTrackingLinks = deliveryNotes.length > 1;

  const handleDownloadDnote = () => {
    openFilePdf('DNote', id, deliveryNotes[0]?.id);
  };
  const handleDownloadInvoice = () => {
    openFilePdf('Invoice', id, invoices[0]?.id);
  };
  const handleCopySerialNumbers = () => {
    const serialsString = line?.serials || '';
    const lineSerials = serialsString.split(',').map((serial) => serial.trim());
    if (Array.isArray(lineSerials)) {
      const serialsText = lineSerials.join('\n');
      serialsText && navigator.clipboard.writeText(serialsText);
    }
    effects.setCustomState({ key: 'toaster', value: { ...toaster } });
  };

  const handleTrackAndTrace = async () => {
    try {
      const endpointUrl = enableLineId
        ? `${config.trackDeliveryEndpoint}/${orderId}/${lineId}/${dNoteId}`
        : `${config.trackDeliveryEndpoint}/${orderId}/${dNoteId}`;
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        const urlParams =
          '?' +
          Object.entries(parameters)
            .map((entry) => entry[0] + '=' + entry[1])
            .join('&');
        const trackUrl = baseUrl + urlParams;
        window.open(trackUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: Change handleReturn  after flyout for multiple return links will be created, add suport for single and multiple return links
  const handleReturn = () => {
    if (isReturnAvailable) {
      const newUrl = line.invoices[0].returnURL;
      window.open(newUrl, '_blank');
    }
  };

  const triggerDNotesFlyout = () => {
    setCustomState({
      key: 'dNotesFlyout',
      value: { data: deliveryNotes, show: true, id, reseller: poNumber },
    });
  };
  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id, reseller: poNumber },
    });
  };
  const triggerTrackingFlyout = () => {
    setCustomState({
      key: 'trackingFlyout',
      value: {
        data: deliveryNotes,
        show: true,
        line,
        id,
      },
    });
  };

  const menuActionsItems = [
    {
      condition: trackAndTraceAvailable,
      label: labels?.track,
      onClick: hasMultipleTrackingLinks
        ? triggerTrackingFlyout
        : handleTrackAndTrace,
    },
    {
      condition: areDeliveryNotesAvailable,
      label: labels?.viewDNotes,
      onClick: hasMultipleDNotes ? triggerDNotesFlyout : handleDownloadDnote,
    },
    {
      condition: hasAIORights && areInvoicesAvailable,
      label: labels?.viewInvoices,
      onClick: hasMultipleInvoices
        ? triggerInvoicesFlyout
        : handleDownloadInvoice,
    },
    {
      condition: isSerialNumberAvailable,
      label: labels?.copySerialNumber,
      onClick: handleCopySerialNumbers,
    },
    {
      condition: isReturnAvailable,
      label: labels?.return,
      onClick: handleReturn,
    },
  ];

  return (
    <div
      className={`cmp-order-tracking-grid-details__splitLine${
        isSingleElement || isLastElement
          ? '__separateLine'
          : '__separateLineMultiple'
      } cmp-order-tracking-grid-details__splitLine--centerAlignActionButton actions-container`}
      onMouseOver={handleActionMouseOver}
      onMouseLeave={handleActionMouseLeave}
    >
      <EllipsisIcon
        className="cmp-order-tracking-grid-details__splitLine__separateLineText"
        style={isShipment ? iconStyle : disabledIconStyle}
      />
      {actionsDropdownVisible && isShipment && (
        <div
          className="actions-dropdown"
          onMouseOver={handleActionMouseOver}
          onMouseLeave={handleActionMouseLeave}
        >
          <MenuActions items={menuActionsItems} />
        </div>
      )}
    </div>
  );
};

export default ActionsButton;
