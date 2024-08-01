import React, { useMemo } from 'react';
import Grid from '../../../OrdersTrackingCommon/Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from './buildColumnDefinitions';
import QuantityColumn from './Columns/QuantityColumn';
import TrackColumn from './Columns/TrackColumn';
import ShipDateColumn from './Columns/ShipDateColumn';
import DNoteColumn from './Columns/DNoteColumn';
import InvoiceColumn from './Columns/InvoiceColumn';
import DropdownColumn from './Columns/DropdownColumn';
import ShippedTabGridRenderers from './Columns/ShippedTabGridRenderers';
import { useOrderTrackingStore } from '../../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * ShippedTabGrid component is responsible for rendering a grid that displays information 
 * about shipped orders. It customizes column definitions and cell renderers based on the 
 * provided data and configuration.
 * 
 * @param {Object} props - The component properties.
 * @param {Array} props.data - The data to be displayed in the grid.
 * @param {Object} props.gridProps - The configuration for the grid.
 * @param {Function} props.openFilePdf - Function to handle opening PDF files for invoices or delivery notes.
 * @param {string} props.reseller - Reseller information for the order.
 * @param {string} props.id - The unique ID of the order.
 * @returns {JSX.Element} The rendered component.
 */
function ShippedTabGrid({ data, gridProps, openFilePdf, reseller, id }) {
  // Fetch translations from the order tracking store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Expand.ShippedTab'];

  // Define grid configuration
  const config = {
    ...gridProps,
    columnList: columnDefs,
    serverSide: false,
    paginationStyle: 'none',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
  };

  // Define fixed grid column widths for different columns
  const gridColumnWidths = Object.freeze({
    dropdownArrow: '50px',
    shipDate: '185px',
    dnote: '158px',
    invoice: '158px',
    qty: '526px',
    track: '184px',
  });

  // Override default column definitions with specific renderers and configurations
  const columnDefinitionsOverride = [
    {
      field: 'dropdownArrow',
      headerName: '',
      width: gridColumnWidths.dropdownArrow,
      cellRenderer: (eventProps) => (
        <section className="cmp-product-lines-grid__row">
          <DropdownColumn
            eventProps={eventProps}
            orderId={id}
          />
        </section>
      ),
    },
    {
      field: 'actualShipDateFormatted',
      headerName: translations?.Column_ShipDate || 'SHIP DATE',
      cellRenderer: ({ data }) => <ShipDateColumn line={data} />,
      width: gridColumnWidths.shipDate,
    },
    {
      field: 'deliveryNotes',
      headerName: translations?.Column_DNote || 'D-NOTE',
      cellRenderer: ({ data }) => (
        <DNoteColumn line={data} id={id} openFilePdf={openFilePdf} />
      ),
      width: gridColumnWidths.dnote,
    },
    {
      field: 'invoices',
      headerName: translations?.Column_Invoice || 'INVOICE',
      cellRenderer: ({ data }) => (
        <InvoiceColumn
          line={data}
          config={config}
          id={id}
          openFilePdf={openFilePdf}
          reseller={reseller}
        />
      ),
      width: gridColumnWidths.invoice,
    },
    {
      field: 'quantity',
      headerName: translations?.Column_Qty || 'QTY',
      cellRenderer: ({ data }) => <QuantityColumn line={data} />,
      width: gridColumnWidths.qty,
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

  // Memoize column definitions to prevent unnecessary recalculations
  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );

  return (
    <section>
      <div className="order-line-details__content__title">
        <span className="order-line-details__content__title-text">
          {translations?.Title || 'Shipped'}
        </span>
      </div>
      <div className="order-line-details__content__grid">
        <Grid
          columnDefinition={myColumnDefs}
          config={config}
          data={data}
          customizedDetailedRender={(props) => (
            <ShippedTabGridRenderers {...props} config={config} />
          )}
          customErrorMessage={true}
        />
      </div>
    </section>
  );
}

export default ShippedTabGrid;