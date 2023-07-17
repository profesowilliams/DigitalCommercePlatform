import React, { useMemo } from 'react';
import Grid from '../../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from '../NotShippedTabGrid/buildColumnDefinitions';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import { getContextMenuItems } from '../../../RenewalsGrid/utils/renewalUtils';
import LineColumn from './Columns/LineColumn';
import QuantityColumn from './Columns/QuantityColumn';
import ItemColumn from './Columns/ItemColumn';
import DeliveryEstimateColumn from './Columns/DeliveryEstimateColumn';
import PnSkuColumn from './Columns/PnSkuColumn';
import ActionColumn from './Columns/ActionColumn';

function NotShippedTabGrid({ data, gridProps, hasOrderModificationRights }) {
  const gridData = data.items ?? [];
  const config = {
    ...gridProps,
    columnList: columnDefs,
    serverSide: false,
    paginationStyle: 'none',
  };

  const gridColumnWidths = Object.freeze({
    lineNumber: '50px',
    item: '165px',
    pnsku: '138px',
    nqty: '164px',
    deliveryEstimate: '164x',
    action: '50px',
  });
  const columnDefinitionsOverride = [
    {
      field: 'lineNumber',
      headerName: getDictionaryValueOrKey(
        config?.orderLineDetailsNotShippedColumnLabels?.lineNumber
      ),
      cellRenderer: ({ data }) => <LineColumn line={data} />,
      width: gridColumnWidths.lineNumber,
    },
    {
      field: 'item',
      headerName: getDictionaryValueOrKey(
        config?.orderLineDetailsNotShippedColumnLabels?.item
      ),
      cellRenderer: ({ data }) => <ItemColumn line={data} config={gridProps} />,
      width: gridColumnWidths.item,
    },
    {
      field: 'pnsku',
      headerName: getDictionaryValueOrKey(
        config?.orderLineDetailsNotShippedColumnLabels?.pnsku
      ),
      cellRenderer: ({ data }) => (
        <PnSkuColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.pnsku,
    },
    {
      field: 'nqty',
      headerName: getDictionaryValueOrKey(
        config?.orderLineDetailsNotShippedColumnLabels?.nqty
      ),
      cellRenderer: ({ data }) => (
        <QuantityColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.nqty,
    },
    {
      field: 'deliveryEstimate',
      headerName: getDictionaryValueOrKey(
        config?.orderLineDetailsNotShippedColumnLabels?.deliveryEstimate
      ),
      cellRenderer: ({ data }) => (
        <DeliveryEstimateColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.deliveryEstimate,
    },
    {
      field: 'action',
      headerName: '',
      cellRenderer: () => <ActionColumn />,
      width: gridColumnWidths.action,
    },
  ];

  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );
  const contextMenuItems = (params) =>
    getContextMenuItems(
      myColumnDefs,
      config?.orderLineDetailsNotShippedColumnLabels
    );
  return (
    <section>
      <div className="order-line-details__content__title">
        <span className="order-line-details__content__title-text">
          {getDictionaryValueOrKey(config?.orderLineDetails?.notShippedLabel)}
        </span>
        {hasOrderModificationRights && (
          <button className="order-line-details__content__title-button">
            {getDictionaryValueOrKey(
              config?.orderLineDetails?.modifyEligibleItems
            )}
          </button>
        )}
      </div>
      <Grid
        columnDefinition={myColumnDefs}
        config={config}
        data={gridData}
        contextMenuItems={contextMenuItems}
      />
    </section>
  );
}

export default NotShippedTabGrid;
