import React, { useEffect, useMemo, useState } from 'react';
import Grid from '../../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from '../NotShippedTabGrid/buildColumnDefinitions';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import LineColumn from './Columns/LineColumn';
import ItemColumn from './Columns/ItemColumn';
import QuantityAndDeliveryEstimateColumn from './Columns/QuantityAndDeliveryEstimateColumn';
import PnSkuColumn from './Columns/PnSkuColumn';
import { useOrderTrackingStore } from '../../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderReleaseModal from '../../Modals/OrderReleaseModal';
import { usPost } from '../../../../../../utils/api';
import OrderReleaseAlertModal from '../../Modals/OrderReleaseAlertModal';
import OrderStatusModal from '../../Modals/OrderStatusModal';
import { GreenInfoIcon } from '../../../../../../fluentIcons/FluentIcons';
import { fetchOrderLinesData } from '../../utils/orderTrackingUtils';

function NotShippedTabGrid({
  data,
  orderEditable,
  gridProps,
  PONo,
  orderNo,
  shipCompleted,
  status,
  ordersOrderEditable,
  activeTab,
  gridRef,
  rowsToGrayOutTDNameRef,
  newItem,
  onQueryChanged,
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
  const orderModificationFlag = useOrderTrackingStore(
    (state) => state.featureFlags.orderModification
  );
  const effects = useOrderTrackingStore((state) => state.effects);

  const { setCustomState, hasRights } = effects;

  const [isTabActive, setIsTabActive] = useState(false);
  const [releaseOrderShow, setReleaseOrderShow] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [openStatusesModal, setOpenStatusesModal] = useState(false);
  const [currency, setCurrency] = useState(null);
  const { lineNumber, item, pnsku, nqty, deliveryEstimate } =
    config?.orderLineDetailsNotShippedColumnLabels || {};
  const hasOrderModificationRights = hasRights('OrderModification');
  const isOrderModificationButtonVisible =
    hasOrderModificationRights && orderEditable && orderModificationFlag;
  const isSeeOptionsButtonVisible =
    orderEditable && hasOrderModificationRights && orderModificationFlag;
  const isReleaseOrderButtonVisible =
    orderModificationFlag &&
    hasOrderModificationRights &&
    shipCompleted &&
    status &&
    ordersOrderEditable;
  const gridColumnWidths = Object.freeze({
    lineNumber: '83px',
    item: '590px',
    pnsku: '250px',
    nqtyDeliveryEstimate: '277px',
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
        <QuantityAndDeliveryEstimateColumn
          line={data}
          config={gridProps}
          id={orderNo}
          isSeeOptionsButtonVisible={isSeeOptionsButtonVisible}
        />
      ),
      width: gridColumnWidths.nqtyDeliveryEstimate,
    },
  ];

  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );

  const handleOrderModification = () => {
    currency &&
      orderEditable &&
      setCustomState({
        key: 'orderModificationFlyout',
        value: {
          data: null,
          id: orderNo,
          show: true,
          gridRef,
          rowsToGrayOutTDNameRef,
          currency,
        },
      });
  };

  const getRowClass = ({ node }) => {
    const nodeData = node.group ? node.aggData : node.data;
    if (rowsToGrayOutTDNameRef.current.includes(nodeData.tdNumber)) {
      return true;
    }
  };

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
          setTimeout(() => {
            onQueryChanged();
          }, 5000);
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

  useEffect(async () => {
    const response = await fetchOrderLinesData(config.uiCommerceServiceDomain, orderNo);
    const currencyFromResponse =
      response?.data?.content?.notShipped[0]?.currency ?? '';
    setCurrency(currencyFromResponse);
    setCustomState({
      key: 'orderModificationFlyout',
      value: {
        id: orderNo,
        currency: currencyFromResponse,
      },
    });
  }, []);

  useEffect(() => {
    if (!isTabActive && activeTab === 1) {
      setIsTabActive(true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (newItem && data) {
      const itemsCopy = [...data];
      const newLineDetails = data[0].lineDetails;
      newLineDetails[0] = { ...newLineDetails[0], statusText: 'New' };
      itemsCopy.unshift({
        ...data[0],
        tdNumber: '',
        key: Math.random(),
        line: '10',
        urlProductImage: newItem.images.default.url,
        displayName: newItem.description,
        mfrNumber: newItem.manufacturerPartNumber,
        unitCost: newItem.price.bestPrice,
        unitPriceCurrency: newItem.price.currency,
        lineTotal: newItem.price.bestPrice,
        isEOL: false,
      });
      gridRef.current?.api.setRowData(itemsCopy);
    }
  }, [newItem]);
  return (
    <section>
      <div className="order-line-details__content__title">
        <span className="order-line-details__content__title-text">
          {getDictionaryValueOrKey(config?.orderLineDetails?.notShippedLabel)}
        </span>
        <span>
          {isReleaseOrderButtonVisible && (
            <button
              className="order-line-details__content__release-button"
              onClick={() => setReleaseOrderShow(true)}
            >
              {getDictionaryValueOrKey(
                config?.orderLineDetails?.releaseButtonLabel
              )}
            </button>
          )}
          {isOrderModificationButtonVisible && currency && (
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
      {isTabActive && (
        <Grid
          columnDefinition={myColumnDefs}
          config={config}
          data={data}
          rowClassRules={rowClassRules}
          gridRef={gridRef}
          customErrorMessage={true}
        />
      )}
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
