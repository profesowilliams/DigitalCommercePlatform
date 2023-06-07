import React from 'react';
import DeliveryNotesColumn from '../Columns/DeliveryNotesColumn';
import InvoiceColumn from '../Columns/InvoiceColumn';
import OrderNoColumn from '../Columns/OrderNoColumn';
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
      updated: data?.updatedFormatted ?? data?.created,
      created: data?.createdFormatted ?? data?.created,
      select: <SelectColumn data={data} eventProps={eventProps} />,
      priceFormatted: <TotalColumn data={data} />,
      invoices: (
        <InvoiceColumn
          id={data?.id}
          invoices={data?.invoices}
          multiple={multiple}
          reseller={data?.reseller}
          openFilePdf={openFilePdf}
          hasAIORights={hasAIORights}
        />
      ),
      deliveryNotes: (
        <DeliveryNotesColumn
          id={data?.id}
          deliveryNotes={data?.deliveryNotes}
          invoices={data?.invoices}
          multiple={multiple}
          reseller={data?.reseller}
          openFilePdf={openFilePdf}
        />
      ),
      id: <OrderNoColumn id={data?.id} detailUrl={detailUrl} />,
      actions: <OrderTrackingActionColumn />,
    };
    const defaultValue = () => (typeof value !== 'object' && value) || '';
    return columnComponents[columnKey] || defaultValue();
  };

  const columnsMinWidth = {
    resellername: 154,
    endUser: 151,
    vendor: 195,
    Id: 139,
    agreementNumber: 148,
    renewedduration: 186,
    dueDays: 127,
    dueDate: 115,
    total: 131,
    actions: 100,
    select: 80,
  };

  const columnsWidth = {
    resellername: '173.368px',
    endUser: '123.368px',
    vendor: '177.632px',
    Id: '150px',
    agreementNumber: '130px',
    renewedduration: '200.632px',
    dueDays: '143.737px',
    dueDate: '139.526px',
    total: '122.526px',
    actions: '100px',
    select: '80px',
  };

  const hoverableList = [
    'endUser',
    'vendor',
    'resellername',
    'renewedduration',
  ];

  const fieldsWithCellStyle = ['Id'];

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
