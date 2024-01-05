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
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getSessionInfo } from '../../../../../utils/user/get';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { isLocalDevelopment, mapServiceData, addCurrencyToColumns } from './utils/gridUtils';
import {
  fetchData,
} from './utils/orderTrackingUtils';

function OrdersTrackingDetailGrid({
  gridProps,
  openFilePdf,
  hasAIORights,
  gridRef,
}) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responseError, setResponseError] = useState(null);
  const config = {
    ...gridProps,
    serverSide: true,
    paginationStyle: 'none',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
    suppressContextMenu: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    domLayout: 'autoHeight',
  };
  const gridApiRef = useRef();

  const hasRights = (entitlement) =>
    userData?.roleList?.some((role) => role.entitlement === entitlement);
  const hasCanViewOrdersRights = hasRights('CanViewOrders');
  const hasOrderTrackingRights = hasRights('OrderTracking');
  const hasAccess =
    hasCanViewOrdersRights || hasOrderTrackingRights || isLocalDevelopment;

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

  const sortedLineDetails = (line) => // TODO:move to UI-COMMERCE
    line?.lineDetails?.slice().sort((a, b) => {
      const dateA = new Date(a.shipDateFormatted);
      const dateB = new Date(b.shipDateFormatted);
      return dateA - dateB;
    });

  const _onAfterGridInit = (config) => {
    gridApiRef.current = config;
  };

  const onDataLoad = () => {
    setIsLoading(false);
  }

  const customRequestInterceptor = async () => {
    const response = await fetchData(config);
    setResponseError(false);
    const mappedResponse = mapServiceData(response);
    return mappedResponse;
  };

  const columnDefinitionsOverride = [
    {
      field: 'id',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineNo),
      cellRenderer: ({ data }) => <LineNumberColumn line={data} />,
      width: gridColumnWidths.id,
    },
    {
      field: 'description',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.description),
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
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.shipDate),
      cellRenderer: ({ data }) => (
        <ShipDateColumn
          line={data}
          config={gridProps}
          sortedLineDetails={sortedLineDetails}
        />
      ),
      width: gridColumnWidths.shipDate,
    },
    {
      field: 'unitPriceFormatted',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.unitPrice),
      cellRenderer: ({ data }) => (
        <UnitCostColumn line={data} sortedLineDetails={sortedLineDetails} />
      ),
      width: gridColumnWidths.unitPriceFormatted,
    },
    {
      field: 'quantity',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.itemsQuantity),
      cellRenderer: ({ data }) => (
        <QuantityColumn line={data} sortedLineDetails={sortedLineDetails} />
      ),
      width: gridColumnWidths.quantity,
    },
    {
      field: 'totalPriceFormatted',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineTotalPrice),
      cellRenderer: ({ data }) => (
        <TotalColumn line={data} sortedLineDetails={sortedLineDetails} />
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
          hasAIORights={hasAIORights}
          sortedLineDetails={sortedLineDetails}
        />
      ),
      width: gridColumnWidths.actions,
    },
  ];

  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );

  const { closeAndCleanToaster } = useOrderTrackingStore((st) => st.effects);

  function onCloseToaster() {
    closeAndCleanToaster();
  }

  useEffect(() => {
    getSessionInfo().then((data) => {
      setUserData(data[1]);
    });
  }, []);

  return (
    <>
      {(userData?.activeCustomer || isLocalDevelopment) && (
        <>
          {hasAccess ? (
            <div className="cmp-order-tracking-details-grid">
              <Grid
                columnDefinition={addCurrencyToColumns(myColumnDefs, userData)}
                config={config}
                gridConfig={config}
                requestInterceptor={customRequestInterceptor}
                mapServiceData={mapServiceData}
                onAfterGridInit={_onAfterGridInit}
                onDataLoad={onDataLoad}
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
            </div>
          ) : (
            <>
              <AccessPermissionsNeeded noAccessProps={noAccessProps} />
            </>
          )}
        </>
      )}
    </>
  );
}
export default OrdersTrackingDetailGrid;