import React, { useEffect, useMemo, useState } from 'react';
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
import { usPost, usGet } from '../../../../../../utils/api';
import OrderReleaseAlertModal from '../../Modals/OrderReleaseAlertModal';

function NotShippedTabGrid({
  data,
  gridProps,
  hasOrderModificationRights,
  isModifiable,
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
  const [openAlert, setOpenAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [orderModificationContent, setOrderModificationContent] =
    useState(null);
  const orderEditable = orderModificationContent?.orderEditable === true;
  const {
    lineNumber,
    item,
    pnsku,
    nqty,
    deliveryEstimate,
    modifyErrorMessage,
  } = config?.orderLineDetailsNotShippedColumnLabels;
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

  const handleOrderModification = () => {
    const toaster = {
      isOpen: true,
      origin: 'fromUpdate',
      isAutoClose: true,
      isSuccess: false,
      message: getDictionaryValueOrKey(modifyErrorMessage),
    };
    orderEditable
      ? setCustomState({
          key: 'orderModificationFlyout',
          value: {
            data: null,
            id: orderNo,
            show: true,
          },
        })
      : effects.setCustomState({ key: 'toaster', value: { ...toaster } });
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
    const url = `${config.uiCommerceServiceDomain}/v2/orders/ChangeDeliveryFlag`;
    const { content } = await usPost(url, params);
    if (content?.ChangeDelFlag?.success) {
      setReleaseSuccess(true);
    } else {
      setReleaseSuccess(false);
    }
    setOpenAlert(true);
  };
  const requestURLData = `${config.uiCommerceServiceDomain}/v3/ordermodification/${orderNo}`;
  const getOrderModificationData = async () => {
    try {
      const result = await usGet(requestURLData);
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    orderNo &&
      getOrderModificationData()
        .then((result) => {
          setOrderModificationContent(result.data.content);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, [orderNo]);
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
          {hasOrderModificationRights && isModifiable && (
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
    </section>
  );
}
export default NotShippedTabGrid;
