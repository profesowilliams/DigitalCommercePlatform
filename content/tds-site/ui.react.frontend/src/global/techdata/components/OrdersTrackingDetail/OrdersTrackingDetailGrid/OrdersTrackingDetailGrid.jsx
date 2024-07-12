import React, { useMemo, useRef, useState, useEffect } from 'react';
import Grid from '../../Grid/Grid';
import buildColumnDefinitions from './buildColumnDefinitions';
import LineNumberColumn from '../Columns/LineNumberColumn';
import DescriptionColumn from '../Columns/DescriptionColumn';
import ActionsColumn from '../Columns/ActionsColumn';
import QuantityColumn from '../Columns/QuantityColumn';
import LineStatusColumn from '../Columns/LineStatusColumn';
import ShipDateColumn from '../Columns/ShipDateColumn';
import TotalColumn from '../Columns/TotalColumn';
import UnitCostColumn from '../Columns/UnitCostColumn';
import Toaster from '../../Widgets/Toaster';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { mapServiceData, prepareGroupedItems } from './utils/gridUtils';
import { fetchData } from './utils/fetchUtils';
import useExtendGridOperations from '../../BaseGrid/Hooks/useExtendGridOperations';
import { useStore } from '../../../../../utils/useStore';
import { GreenInfoIcon } from '../../../../../fluentIcons/FluentIcons';
import OrderStatusModal from '../../OrdersTrackingGrid/Modals/OrderStatusModal';

function OrdersTrackingDetailGrid({
  content,
  gridProps,
  openFilePdf,
  gridRef,
  rowsToGrayOutTDNameRef,
  isLoading
}) {
  const [responseError, setResponseError] = useState(null);
  const [openStatusesModal, setOpenStatusesModal] = useState(false);
  const refreshOrderTrackingDetailApi = useStore(
    (state) => state.refreshOrderTrackingDetailApi
  );

  const resetCallback = useRef(null);
  const shouldGoToFirstPage = useRef(false);
  const isOnSearchAction = useRef(false);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
    useOrderTrackingStore,
    { resetCallback, shouldGoToFirstPage, isOnSearchAction }
  );

  const groupLinesFlag = useOrderTrackingStore(
    (state) => state.featureFlags.groupLines
  );
  const groupLinesFlagRef = useRef(groupLinesFlag);
  const config = {
    ...gridProps,
    serverSide: true,
    paginationStyle: 'none',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    suppressMultiSort: true,
    ensureDomOrder: true,
    domLayout: 'autoHeight',
    itemsPerPage: 99999
  };
  const gridApiRef = useRef();
  let id = useRef('');
  const currency = useRef();

  const gridColumnWidths = Object.freeze({
    id: '95px',
    description: '287px',
    status: '173x',
    shipDate: '99px',
    unitPriceFormatted: '150px',
    quantity: '58px',
    totalPriceFormatted: '150px',
    actions: '50px',
  });

  const sortedLineDetails = (
    line // TODO:move to UI-COMMERCE
  ) =>
    line?.lineDetails?.slice().sort((a, b) => {
      const dateA = new Date(a.shipDateFormatted);
      const dateB = new Date(b.shipDateFormatted);
      return dateA - dateB;
    });

  const _onAfterGridInit = (config) => {
    onAfterGridInit(config);
    gridApiRef.current = config;
  };

  const customRequestInterceptor = async () => {
    console.log('OrdersTrackingDetailGrid::customRequestInterceptor');

    if (!id?.current || isLoading)
      return [];

    const response = await fetchData(config, id.current);
    let mappedResponse;
    if ('groupedItems' in response.data.content && groupLinesFlagRef.current) {
      const groupedItemsResponse = mapServiceData({
        ...response,
        data: {
          content: {
            ...response.data.content,
            items: [
              ...response.data.content.items,
              ...prepareGroupedItems(response.data.content),
            ],
          },
        },
      });
      mappedResponse = groupedItemsResponse;
    } else {
      mappedResponse = mapServiceData(response);
    }
    setResponseError(false);
    return mappedResponse;
  };

  const customStatusComponent = () => (
    <div className="ag-cell-label-container">
      <span className="ag-header-cell-text">
        {getDictionaryValueOrKey(config?.itemsLabels?.shipDate)}
        <GreenInfoIcon onClick={() => setOpenStatusesModal(true)} />
      </span>
    </div>
  );

  const createColumnDefinitions = () => {
    console.log('OrdersTrackingDetailGrid::createColumnDefinitions::' + currency?.current);

    if (!currency?.current) {
      return null;
    }

    return buildColumnDefinitions([
      {
        field: 'id',
        headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineNo),
        cellRenderer: ({ data }) => (
          <LineNumberColumn line={data} labels={config?.itemsLabels} />
        ),
        width: gridColumnWidths.id,
      },
      {
        field: 'description',
        headerName: getDictionaryValueOrKey(config?.itemsLabels?.descriptionPN),
        cellRenderer: ({ data }) => (
          <DescriptionColumn line={data} config={gridProps} />
        ),
        width: gridColumnWidths.description,
      },
      {
        field: 'status',
        headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineStatus),
        cellRenderer: ({ data }) => (
          <LineStatusColumn
            line={data}
            config={gridProps}
            sortedLineDetails={sortedLineDetails}
          />
        ),
        width: gridColumnWidths.status,
      },
      {
        field: 'shipDate',
        headerComponentFramework: customStatusComponent,
        cellRenderer: ({ data }) => (
          <ShipDateColumn
            line={data}
            config={gridProps}
            sortedLineDetails={sortedLineDetails}
            rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          />
        ),
        width: gridColumnWidths.shipDate,
      },
      {
        field: 'unitPriceFormatted',
        headerName: getDictionaryValueOrKey(config?.itemsLabels?.unitPrice)?.replace('{currency-code}', currency?.current),
        cellRenderer: ({ data }) => (
          <UnitCostColumn line={data} sortedLineDetails={sortedLineDetails} />
        ),
        width: gridColumnWidths.unitPriceFormatted,
      },
      {
        field: 'quantity',
        headerName: getDictionaryValueOrKey(config?.itemsLabels?.itemsQuantity),
        cellRenderer: ({ data }) => (
          <QuantityColumn
            line={data}
            sortedLineDetails={sortedLineDetails}
            rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          />
        ),
        width: gridColumnWidths.quantity,
      },
      {
        field: 'totalPriceFormatted',
        headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineTotalPrice)?.replace('{currency-code}', currency?.current),
        cellRenderer: ({ data }) => (
          <TotalColumn
            line={data}
            sortedLineDetails={sortedLineDetails}
            rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          />
        ),
        width: gridColumnWidths.totalPriceFormatted,
      },
      {
        field: 'actions',
        headerName: '',
        cellRenderer: ({ data }) => (
          <ActionsColumn
            line={data}
            config={gridProps}
            openFilePdf={openFilePdf}
            sortedLineDetails={sortedLineDetails}
          />
        ),
        width: gridColumnWidths.actions,
      },
    ]);
  }

  const columnDefinition = useMemo(
    () => createColumnDefinitions(),
    [currency.current]
  );

  const getRowClass = ({ node }) => {
    const data = node.group ? node.aggData : node.data;
    if (rowsToGrayOutTDNameRef.current.includes(data?.tdNumber)) {
      return true;
    }
  };

  const getGroupHeaderClass = ({ node }) => {
    const data = node.group ? node.aggData : node.data;
    if (data?.manufacturer) {
      return true;
    }
  };

  const rowClassRules = {
    'gray-out-changing-rows': getRowClass,
    'group-header-row': getGroupHeaderClass,
  };

  const { closeAndCleanToaster } = useOrderTrackingStore((st) => st.effects);

  const onCloseToaster = () => {
    closeAndCleanToaster();
  };

  useEffect(() => {
    console.log('OrdersTrackingDetailGrid::useEffect::lineDetails');
    onQueryChanged();
  }, [refreshOrderTrackingDetailApi?.lineDetails]);

  useEffect(() => {
    console.log('OrdersTrackingDetailGrid::useEffect::content');
    if (content) {
      id.current = content.orderNumber;
      currency.current = content.paymentDetails?.currency;
      onQueryChanged();
    }
  }, [content]);

  useEffect(() => {
    console.log('OrdersTrackingDetailGrid::useEffect::groupLinesFlag');
    groupLinesFlagRef.current = groupLinesFlag;
  }, [groupLinesFlag]);

  useEffect(() => {
    console.log('OrdersTrackingDetailGrid::useEffect::isLoading');
    if (isLoading) {
      gridRef?.current?.api.showLoadingOverlay();
    }
  }, [isLoading]);

  return (<>
    {columnDefinition &&
      (<div className="cmp-order-tracking-details-grid">
        <Grid
          columnDefinition={columnDefinition}
          config={config}
          gridConfig={config}
          requestInterceptor={customRequestInterceptor}
          mapServiceData={mapServiceData}
          onAfterGridInit={_onAfterGridInit}
          //loadingCellRenderer={loadingCellRenderer}
          rowClassRules={rowClassRules}
          gridRef={gridRef}
          responseError={responseError}
        />
        <Toaster
          classname="toaster-modal-otg"
          onClose={onCloseToaster}
          closeEnabled
          store={useOrderTrackingStore}
          message={{
            successSubmission: 'successSubmission',
            failedSubmission: 'failedSubmission',
          }}
        />
        <OrderStatusModal
          open={openStatusesModal}
          handleClose={() => {
            setOpenStatusesModal(false);
          }}
          labels={config?.statusesLabels}
        />
      </div>)}
  </>);
}

export default OrdersTrackingDetailGrid;