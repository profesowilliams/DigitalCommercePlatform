import React, { useMemo } from 'react';
import Grid from '../../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from './buildColumnDefinitions';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import QuantityColumn from './Columns/QuantityColumn';
import TrackColumn from './Columns/TrackColumn';
import ShipDateColumn from './Columns/ShipDateColumn';
import DNoteColumn from './Columns/DNoteColumn';
import InvoiceColumn from './Columns/InvoiceColumn';
import DropdownColumn from './Columns/DropdownColumn';
import ShippedTabGridRenderers from './Columns/ShippedTabGridRenderers';
function ShippedTabGrid({
  data,
  gridProps,
  openFilePdf,
  hasAIORights,
  reseller,
  id,
}) {
  const config = {
    ...gridProps,
    columnList: columnDefs,
    serverSide: false,
    paginationStyle: 'none',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
  };
  const enableGrid = data.length > 0;
  const { shipDate, dnote, invoice, value, qty } =
    config?.orderLineDetailsShippedColumnLabels;
  const gridColumnWidths = Object.freeze({
    dropdownArrow: '50px',
    shipDate: '185px',
    dnote: '158px',
    invoice: '158px',
    qty: '526px',
    track: '184px',
  });
  const columnDefinitionsOverride = [
    {
      field: 'dropdownArrow',
      headerName: '',
      width: gridColumnWidths.dropdownArrow,
      cellRenderer: (eventProps) => (
        <section className="cmp-product-lines-grid__row">
          <DropdownColumn eventProps={eventProps} />
        </section>
      ),
    },
    {
      field: 'actualShipDateFormatted',
      headerName: getDictionaryValueOrKey(shipDate),
      cellRenderer: ({ data }) => <ShipDateColumn line={data} />,
      width: gridColumnWidths.shipDate,
    },
    {
      field: 'deliveryNotes',
      headerName: getDictionaryValueOrKey(dnote),
      cellRenderer: ({ data }) => (
        <DNoteColumn line={data} id={id} openFilePdf={openFilePdf} />
      ),
      width: gridColumnWidths.dnote,
    },
    {
      field: 'invoices',
      headerName: getDictionaryValueOrKey(invoice),
      cellRenderer: ({ data }) => (
        <InvoiceColumn
          line={data}
          config={config}
          id={id}
          openFilePdf={openFilePdf}
          hasAIORights={hasAIORights}
          reseller={reseller}
        />
      ),
      width: gridColumnWidths.invoice,
    },
    {
      field: 'quantity',
      headerName: getDictionaryValueOrKey(qty),
      cellRenderer: ({ data }) => <QuantityColumn line={data} />,
      width: gridColumnWidths.quantity,
    },
    {
      field: 'track',
      headerName: '',
      cellRenderer: ({ data }) => (
        <TrackColumn line={data} config={config} id={id} />
      ),
      width: gridColumnWidths.track,
    },
  ];
  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );
  return (
    <section>
      <div className="order-line-details__content__title">
        <span className="order-line-details__content__title-text">
          {getDictionaryValueOrKey(config?.orderLineDetails?.shippedLabel)}
        </span>
      </div>
      {enableGrid && (
        <div className="order-line-details__content__grid">
          <Grid
            columnDefinition={myColumnDefs}
            config={config}
            data={data}
            customizedDetailedRender={(props) => (
              <ShippedTabGridRenderers {...props} config={config} />
            )}
          />
        </div>
      )}
    </section>
  );
}
export default ShippedTabGrid;
