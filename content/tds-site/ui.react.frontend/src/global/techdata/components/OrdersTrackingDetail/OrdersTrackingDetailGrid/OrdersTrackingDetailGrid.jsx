import React, { useMemo, useState, useEffect } from 'react';
import Grid from '../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from './buildColumnDefinitions';
import DescriptionColumn from '../Columns/DescriptionColumn';
import ActionsColumn from '../Columns/ActionsColumn';
import QuantityColumn from '../Columns/QuantityColumn';
import LineStatusColumn from '../Columns/LineStatusColumn';
import ShipDateColumn from '../Columns/ShipDateColumn';
import Toaster from '../../Widgets/Toaster';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import { getSessionInfo } from "../../../../../utils/user/get";
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../../utils/featureFlagUtils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../../utils/constants';

function OrdersTrackingDetailGrid({
  data,
  gridProps,
  openFilePdf,
  hasAIORights,
  gridRef,
  rowToGrayOutTDNameRef,
}) {
  const [userData, setUserData] = useState(null);
  const gridData = data.items ?? [];
  const apiResponse = data;
  const config = {
    ...gridProps,
    columnList: columnDefs,
    serverSide: false,
    paginationStyle: 'none',
  };

  const userDataLS = localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA))
    : null;
  const currentUserData =
    isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : userDataLS;

  const activeCustomer = currentUserData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';

  const gridColumnWidths = Object.freeze({
    actions: '50px',
    description: '287px',
    id: '95px',
    quantity: '58px',
    shipDate: '99px',
    status: '173x',
    totalPriceFormatted: '150px',
    unitPriceFormatted: '150px',
  });

  const columnDefinitionsOverride = [
    {
      field: 'id',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineNo),
      width: gridColumnWidths.id,
    },
    {
      field: 'description',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.description),
      cellHeight: () => 80,
      cellRenderer: ({ data }) => (
        <DescriptionColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.description,
    },
    {
      field: 'status',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.lineStatus),
      cellRenderer: ({ data }) => <LineStatusColumn line={data} />,
      width: gridColumnWidths.status,
    },
    {
      field: 'shipDate',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.shipDate),
      cellRenderer: ({ data }) => (
        <ShipDateColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.shipDate,
    },
    {
      field: 'unitPriceFormatted',
      headerName: getDictionaryValueOrKey(
        config?.itemsLabels?.unitPrice
      )?.replace(
        '{currency-code}',
        data?.paymentDetails?.currency || defaultCurrency
      ),
      width: gridColumnWidths.unitPriceFormatted,
    },
    {
      field: 'quantity',
      headerName: getDictionaryValueOrKey(config?.itemsLabels?.itemsQuantity),
      cellRenderer: ({ data }) => (
        <QuantityColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.quantity,
    },
    {
      field: 'totalPriceFormatted',
      headerName: getDictionaryValueOrKey(
        config?.itemsLabels?.lineTotalPrice
      )?.replace(
        '{currency-code}',
        data?.paymentDetails?.currency || defaultCurrency
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
          apiResponse={apiResponse}
          hasAIORights={hasAIORights}
        />
      ),
      width: gridColumnWidths.actions,
    },
  ];

  function getRowClass({ node }) {
    const data = node.group ? node.aggData : node.data;
    if (data.tdNumber === rowToGrayOutTDNameRef.current) {
      return true;
    }
  }

  const rowClassRules = {
    'gray-out-changing-rows': getRowClass,
  };

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
    <section>
      <Grid
        //onAfterGridInit={onAfterGridInit}
        columnDefinition={myColumnDefs}
        config={config}
        data={gridData}
        //getDefaultCopyValue={getDefaultCopyValue}
        contextMenuItems={() => {}}
        rowClassRules={rowClassRules}
        gridRef={gridRef}
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
    </section>
  );
}

export default OrdersTrackingDetailGrid;
