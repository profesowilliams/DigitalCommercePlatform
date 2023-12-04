import React, { useMemo, useState } from 'react';
import Grid from '../../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from '../NotShippedTabGrid/buildColumnDefinitions';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import LineColumn from './Columns/LineColumn';
import QuantityColumn from './Columns/QuantityColumn';
import ItemColumn from './Columns/ItemColumn';
import DeliveryEstimateColumn from './Columns/DeliveryEstimateColumn';
import PnSkuColumn from './Columns/PnSkuColumn';
import { useOrderTrackingStore } from '../../store/OrderTrackingStore';
import OrderReleaseModal from '../../Modals/OrderReleaseModal';
import { usGet } from '../../../../../../utils/api';

function NotShippedTabGrid({
  data,
  gridProps,
  hasOrderModificationRights,
  gridRef,
  rowsToGrayOutTDNameRef,
  PONo,
  orderNo,
  shipCompleted,
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
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;
  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const { lineNumber, item, pnsku, nqty, deliveryEstimate } =
    config?.orderLineDetailsNotShippedColumnLabels;
  const gridColumnWidths = Object.freeze({
    lineNumber: '60px',
    item: '425px',
    pnsku: '180px',
    nqty: '70px',
    deliveryEstimate: '164x',
    action: '60px',
  });
  const columnDefinitionsOverride = [
    {
      field: 'lineNumber',
      headerName: getDictionaryValueOrKey(lineNumber),
      cellRenderer: ({ data }) => <LineColumn line={data} />,
      width: gridColumnWidths.lineNumber,
    },
    {
      field: 'item',
      headerName: getDictionaryValueOrKey(item),
      cellRenderer: ({ data }) => <ItemColumn line={data} />,
      width: gridColumnWidths.item,
    },
    {
      field: 'pnsku',
      headerName: getDictionaryValueOrKey(pnsku),
      cellRenderer: ({ data }) => <PnSkuColumn line={data} />,
      width: gridColumnWidths.pnsku,
    },
    {
      field: 'nqty',
      headerName: getDictionaryValueOrKey(nqty),
      cellRenderer: ({ data }) => (
        <QuantityColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.nqty,
    },
    {
      field: 'deliveryEstimate',
      headerName: getDictionaryValueOrKey(deliveryEstimate),
      cellRenderer: ({ data }) => <DeliveryEstimateColumn line={data} />,
      width: gridColumnWidths.deliveryEstimate,
    },
  ];
  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );

  const handleReleaseOrder = async () => {
    const url = `${componentProp.uiCommerceServiceDomain}/v3/orders/ChangeDeliveryFlag?OrderId=${orderNo}`;
    await usGet(url);
  };

  const handleOrderModification = () => {
    setCustomState({
      key: 'orderModificationFlyout',
      value: { data: {}, show: true },
    });
  };
  function getRowClass({ node }) {
    const nodeData = node.group ? node.aggData : node.data;
    if (rowsToGrayOutTDNameRef.current.includes(nodeData.tdNumber)) {
      return true;
    }
  }
  const rowClassRules = {
    'gray-out-changing-rows': getRowClass,
  };
  return (
    <section>
      <div className="order-line-details__content__title">
        <span className="order-line-details__content__title-text">
          {getDictionaryValueOrKey(config?.orderLineDetails?.notShippedLabel)}
        </span>
        {shipCompleted && (
          <button
            className="order-line-details__content__release-button"
            onClick={() => setReleaseOrderShow(true)}
          >
            {getDictionaryValueOrKey(
              config?.orderLineDetails?.releaseButtonLabel
            )}
          </button>
        )}
        {hasOrderModificationRights && (
          <button
            className="order-line-details__content__title-button"
            onClick={handleOrderModification}
          >
            {getDictionaryValueOrKey(
              config?.orderLineDetails?.modifyEligibleItemsLabel
            )}
          </button>
        )}
      </div>
      <div>
        <Grid
          columnDefinition={myColumnDefs}
          config={config}
          data={data}
          rowClassRules={rowClassRules}
          gridRef={gridRef}
        />
      </div>
      <OrderReleaseModal
        open={releaseOrderShow}
        handleClose={() => setReleaseOrderShow(false)}
        handleReleaseOrder={handleReleaseOrder}
        orderLineDetails={config?.orderLineDetails}
        orderNo={orderNo}
        PONo={PONo}
      />
    </section>
  );
}
export default NotShippedTabGrid;
