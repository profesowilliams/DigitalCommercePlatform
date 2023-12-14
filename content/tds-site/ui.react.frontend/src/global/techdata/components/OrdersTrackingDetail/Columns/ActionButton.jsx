import React, { useState } from 'react';
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
  openFilePdf
}) => {
  const iconStyle = {
    color: '#21314D',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '1.3rem',
  };
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const multiple = line?.lineDetails?.length > 1;
  const isLastElement = multiple && index === line?.lineDetails?.length - 1;
  const isSingleElement = !multiple;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };
  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };
  const effects = useOrderTrackingStore((st) => st.effects);
  const { setCustomState } = effects;
  const labels = config?.actionLabels;
  const invoices = element.invoices;
  const deliveryNotes = element.deliveryNotes;
  const invoicesWithReturnURL = invoices?.filter(
    (invoice) => invoice.returnUrl && invoice.returnUrl.length > 0
  );

  const id = line.orderNumber;
  const poNumber = line.customerPO;
  const orderId = id;
  const lineId = line.line;
  const enableLineId = line.line.length === 1;
  const dNoteId = deliveryNotes?.length > 0 ? deliveryNotes[0].id : null;

  const toaster = {
    isOpen: true,
    origin: 'fromUpdate',
    isAutoClose: true,
    isSuccess: true,
    message: getDictionaryValueOrKey(
      config?.actionLabels?.toasterCopySerialNumbersMessage
    ),
  };

  const hasMultipleInvoices = invoices?.length > 1;
  const hasMultipleReturnLinks =
    invoices?.length > 1 && invoicesWithReturnURL.length > 1;

  const isInvoiceDownloadable = invoices?.some(
    (invoice) => invoice.canDownloadDocument
  );

  const trackAndTraceAvailable = line?.canTrackAndTrace;
  const areDeliveryNotesAvailable =
    deliveryNotes?.length === 1 && deliveryNotes[0].canDownloadDocument;
  const areInvoicesAvailable =
    invoices?.length > 1 || (invoices?.length === 1 && isInvoiceDownloadable);
  const isSerialNumberAvailable = element.serialsAny === true;
  const isReturnAvailable =
    invoices?.length > 0 && invoicesWithReturnURL.length >= 1;

  const handleDownloadDnote = () => {
    openFilePdf('DNote', id, dNoteId);
  };

  const handleDownloadInvoice = () => {
    if (isInvoiceDownloadable) {
      openFilePdf('Invoice', id, invoices[0]?.id);
    }
  };

  const handleCopySerialNumbers = async () => {
    const result = await usGet(
      `${config.uiCommerceServiceDomain}/v3/orderdetails/${id}/line/${lineId}/deliverynote/${dNoteId}/serials`
    );
    const lineSerials = result?.data?.content;
    const serialsText = lineSerials.join('\n');
    serialsText && navigator.clipboard.writeText(serialsText);
    effects.setCustomState({ key: 'toaster', value: { ...toaster } });
  };

  const handleTrackAndTrace = async () => {
    try {
      const endpointUrl = enableLineId
        ? `${config.uiCommerceServiceDomain}/v3/order/carrierurl/${orderId}/${lineId}/${dNoteId}`
        : `${config.uiCommerceServiceDomain}/v3/order/carrierurl/${orderId}/${dNoteId}`;
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        const trackAndTraceUrl = new URL(baseUrl);
        if (parameters) {
          Object.entries(parameters).forEach((entry) =>
            trackAndTraceUrl.searchParams.append(entry[0], entry[1])
          );
        }
        window.open(trackAndTraceUrl.href, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReturn = () => {
    const newUrl = element.invoices[0].returnUrl;
    window.open(newUrl, '_blank');
  };

  const triggerInvoicesFlyout = () => {
    setCustomState({
      key: 'invoicesFlyout',
      value: { data: invoices, show: true, id, reseller: poNumber },
    });
  };

  const triggerReturnFlyout = () => {
    setCustomState({
      key: 'returnFlyout',
      value: {
        data: invoices,
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
      onClick: handleTrackAndTrace,
    },
    {
      condition: areDeliveryNotesAvailable,
      label: labels?.viewDNotes,
      onClick: handleDownloadDnote,
    },
    {
      condition: areInvoicesAvailable,
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
      onClick: hasMultipleReturnLinks ? triggerReturnFlyout : handleReturn,
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
        style={iconStyle}
      />
      {actionsDropdownVisible && (
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
