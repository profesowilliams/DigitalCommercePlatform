import React, { useEffect, useMemo, useState } from 'react';
import Grid from '../../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from '../NotShippedTabGrid/buildColumnDefinitions';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import LineColumn from './Columns/LineColumn';
import ItemColumn from './Columns/ItemColumn';
import QuantityAndDeliveryEstimateColumn from './Columns/QuantityAndDeliveryEstimateColumn';
import PnSkuColumn from './Columns/PnSkuColumn';
import { useOrderTrackingStore } from '../../store/OrderTrackingStore';
import OrderReleaseModal from '../../Modals/OrderReleaseModal';
import { usPost } from '../../../../../../utils/api';
import OrderReleaseAlertModal from '../../Modals/OrderReleaseAlertModal';
import OrderStatusModal from '../../Modals/OrderStatusModal';
import { GreenInfoIcon } from '../../../../../../fluentIcons/FluentIcons';

function NotShippedTabGrid({
  data,
  orderEditable,
  gridProps,
  hasOrderModificationRights,
  gridRef,
  rowsToGrayOutTDNameRef,
  PONo,
  orderNo,
  shipCompleted,
  status,
  ordersOrderEditable,
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
  const [openAlert, setOpenAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [openStatusesModal, setOpenStatusesModal] = useState(false);
  const { lineNumber, item, pnsku, nqty, deliveryEstimate } =
    config?.orderLineDetailsNotShippedColumnLabels;
  const gridColumnWidths = Object.freeze({
    lineNumber: '60px',
    item: '425px',
    pnsku: '180px',
    nqtyDeliveryEstimate: '234px',
    action: '60px',
  });
  const CustomHeaderComponent = () => (
    <div className="not-shipped-header-end">
      <div className="not-shipped-header-end__qty-column">
        {getDictionaryValueOrKey(nqty)}
      </div>
      <div className="not-shipped-header-end__delivery-column">
        {getDictionaryValueOrKey(deliveryEstimate)}
        <GreenInfoIcon onClick={() => setOpenStatusesModal(true)} />
      </div>
    </div>
  );
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
      field: 'nqtyDeliveryEstimate',
      headerComponentFramework: CustomHeaderComponent,
      cellRenderer: ({ data }) => (
        <QuantityAndDeliveryEstimateColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.deliveryEstimate,
    },
  ];
  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );

  const handleOrderModification = () => {
    orderEditable &&
      setCustomState({
        key: 'orderModificationFlyout',
        value: {
          data: null,
          id: orderNo,
          show: true,
        },
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
  const handleReleaseOrder = async () => {
    setReleaseOrderShow(false);
    const params = {
      OrderId: orderNo,
    };
    const url = `${config.uiCommerceServiceDomain}/v2/ChangeDeliveryFlag`;
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
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
        }, 5000);
      });
  };

  useEffect(() => {
    setCustomState({
      key: 'orderModificationFlyout',
      value: {
        id: orderNo,
      },
    });
  }, []);

  return (
    <section>
      <div className="order-line-details__content__title">
        <span className="order-line-details__content__title-text">
          {getDictionaryValueOrKey(config?.orderLineDetails?.notShippedLabel)}
        </span>
        <span>
          {shipCompleted && status && ordersOrderEditable && (
            <button
              className="order-line-details__content__release-button"
              onClick={() => setReleaseOrderShow(true)}
            >
              {getDictionaryValueOrKey(
                config?.orderLineDetails?.releaseButtonLabel
              )}
            </button>
          )}
          {hasOrderModificationRights && orderEditable && (
            <button
              className="order-line-details__content__title-button"
              onClick={handleOrderModification}
            >
              {getDictionaryValueOrKey(
                config?.orderLineDetails?.modifyEligibleItemsLabel
              )}
            </button>
          )}
        </span>
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
      <OrderReleaseAlertModal
        open={openAlert}
        handleClose={() => {
          setOpenAlert(false);
        }}
        orderLineDetails={config?.orderLineDetails}
        releaseSuccess={releaseSuccess}
      />
      <OrderStatusModal
        open={openStatusesModal}
        handleClose={() => {
          setOpenStatusesModal(false);
        }}
        labels={config?.statusesLabels}
      />
    </section>
  );
}
export default NotShippedTabGrid;
