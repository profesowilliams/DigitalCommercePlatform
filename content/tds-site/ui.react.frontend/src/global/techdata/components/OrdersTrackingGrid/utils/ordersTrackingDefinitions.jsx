import React from 'react';
import DeliveryNotesColumn from '../Columns/DeliveryNotesColumn';
import InvoiceColumn from '../Columns/InvoiceColumn';
import OrderNoColumn from '../Columns/OrderNoColumn';
import ShipToColumn from '../Columns/ShipToColumn';
import ResellerColumn from '../Columns/ResellerColumn';
import SelectColumn from '../Columns/SelectColumn';
import TotalColumn from '../Columns/TotalColumn';
import StatusColumn from '../Columns/StatusColumn';

export const ordersTrackingDefinition = (
  { detailUrl, multiple, orderModifyLabels },
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
      select: <SelectColumn eventProps={eventProps} />,
      updated: data?.updatedFormatted ?? data?.created,
      shipTo: <ShipToColumn data={data?.shipTo} />,
      statusText: (
        <StatusColumn
          data={data}
          completeDeliveryOnly={orderModifyLabels.completeDeliveryOnly}
        />
      ),
      created: data?.createdFormatted ?? data?.created,
      id: <OrderNoColumn id={data?.id} detailUrl={detailUrl} />,
      customerPO: <ResellerColumn data={data?.customerPO} />,
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
    };
    const defaultValue = () => (typeof value !== 'object' && value) || '';
    return columnComponents[columnKey] || defaultValue();
  };

  const columnsMinWidth = {
    select: 35,
    updated: 90,
    shipTo: 160,
    statusText: 140,
    created: 110,
    id: 100,
    customerPO: 160,
    priceFormatted: 130,
    invoices: 100,
    deliveryNotes: 100,
  };

  const columnsWidth = {
    select: '35px',
    updated: '90px',
    shipTo: '160px',
    statusText: '140px',
    created: '110px',
    id: '100px',
    customerPO: '160px',
    priceFormatted: '130px',
    invoices: '100px',
    deliveryNotes: '100px',
  };

  const hoverableList = ['select', 'id', 'invoices', 'deliveryNotes'];

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
