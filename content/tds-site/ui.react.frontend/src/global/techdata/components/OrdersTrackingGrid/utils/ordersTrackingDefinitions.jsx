import React from 'react';
import DeliveryNotesColumn from '../Columns/DeliveryNotesColumn';
import InvoiceColumn from '../Columns/InvoiceColumn';
import OrderNoColumn from '../Columns/OrderNoColumn';
import ShipToColumn from '../Columns/ShipToColumn';
import ResellerColumn from '../Columns/ResellerColumn';
import OrderTrackingActionColumn from '../Columns/OrderTrackingActionColumn';

import SelectColumn from '../Columns/SelectColumn';
import TotalColumn from '../Columns/TotalColumn';

export const ordersTrackingDefinition = (
  { detailUrl, multiple },
  openFilePdf,
  hasAIORights
) => {
  const createColumnComponent = (eventProps, aemDefinition) => {
    const { columnKey } = aemDefinition;
    const { value, data } = eventProps;
    const columnComponents = {
      // US 399164: We will update the field mapping later when the UI service is ready.
      // pniewiadomski: I'll add a null check and render `created` for the time being so that it will be testable on mocked api
      // and will render order date on DIT and SIT env
      //TODO: delete invoices prop form DeliveryNotesColumn after BE create mock request for downloading dnotes
      select: <SelectColumn eventProps={eventProps} />,
      updated: data?.updatedFormatted ?? data?.created,
      shipTo: <ShipToColumn data={data?.shipTo} />,
      created: data?.createdFormatted ?? data?.created,
      id: <OrderNoColumn id={data?.id} detailUrl={detailUrl} />,
      reseller: <ResellerColumn data={data?.customerPO} />,
      priceFormatted: <TotalColumn data={data} />,
      invoices: (
        <InvoiceColumn
          id={data?.id}
          invoices={data?.invoices}
          multiple={multiple}
          reseller={data?.customerPO}
          openFilePdf={openFilePdf}
          hasAIORights={hasAIORights}
        />
      ),
      deliveryNotes: (
        <DeliveryNotesColumn
          id={data?.id}
          deliveryNotes={data?.deliveryNotes}
          multiple={multiple}
          reseller={data?.customerPO}
          openFilePdf={openFilePdf}
        />
      ),
      actions: <OrderTrackingActionColumn />,
    };
    const defaultValue = () => (typeof value !== 'object' && value) || '';
    return columnComponents[columnKey] || defaultValue();
  };

  const columnsMinWidth = {
    select: 84,
    updated: 94,
    shipTo: 160,
    status: 112,
    created: 94,
    id: 104,
    reseller: 173,
    priceFormatted: 112,
    invoices: 100,
    deliveryNotes: 100,
    actions: 100,
  };

  const columnsWidth = {
    select: '84px',
    updated: '94px',
    shipTo: '160px',
    status: '112px',
    created: '94px',
    id: '104px',
    reseller: '173px',
    priceFormatted: '112px',
    invoices: '100px',
    deliveryNotes: '100px',
    actions: '100px',
  };

  const hoverableList = [
    'select',
    'id',
    'invoices',
    'deliveryNotes',
    'actions',
  ];

  const fieldsWithCellStyle = ['id'];

  const cellStyle = {
    'text-overflow': 'initial',
    'white-space': 'nowrap',
    overflow: 'visible',
    padding: 0,
  };

  const columnOverrides = (aemDefinition) => {
    return {
      hoverable: hoverableList.includes(aemDefinition?.columnKey),
      ...(aemDefinition?.type === 'plainText' ? { cellHeight: () => 45 } : {}),
      minWidth: columnsMinWidth[aemDefinition?.columnKey] || null,
      width: columnsWidth[aemDefinition?.columnKey] || null,
      resizable: false,
      ...(fieldsWithCellStyle.includes(aemDefinition?.columnKey)
        ? { cellStyle }
        : {}),
    };
  };
  return {
    columnOverrides,
    createColumnComponent,
  };
};
