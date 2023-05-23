import React, { useMemo, useState, useEffect } from 'react';
import Grid from '../../Grid/Grid';
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from './buildColumnDefinitions';
import DescriptionColumn from '../Columns/DescriptionColumn';
import ActionsColumn from '../Columns/ActionsColumn';
import QuantityColumn from '../Columns/QuantityColumn';
import LineStatusColumn from '../Columns/LineStatusColumn';
import ShipDateColumn from '../Columns/ShipDateColumn';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getContextMenuItems } from '../../RenewalsGrid/utils/renewalUtils';
import {
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../../utils/featureFlagUtils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../../utils/constants';

function OrdersTrackingDetailGrid({ data, gridProps }) {
  const [userData, setUserData] = useState(null);
  const gridData = data.items ?? [];
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
      headerName: getDictionaryValueOrKey(config?.labels?.lineNo),
      width: gridColumnWidths.id,
    },
    {
      field: 'description',
      headerName: getDictionaryValueOrKey(config?.labels?.lineDescription),
      cellHeight: () => 80,
      cellRenderer: ({ data }) => (
        <DescriptionColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.description,
    },
    {
      field: 'status',
      headerName: getDictionaryValueOrKey(config?.labels?.lineStatus),
      cellRenderer: ({ data }) => <LineStatusColumn line={data} />,
      width: gridColumnWidths.status,
    },
    {
      field: 'shipDate',
      headerName: getDictionaryValueOrKey(config?.labels?.lineShipDate),
      cellRenderer: ({ data }) => (
        <ShipDateColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.shipDate,
    },
    {
      field: 'unitPriceFormatted',
      headerName: getDictionaryValueOrKey(
        config?.labels?.lineUnitPrice
      )?.replace(
        '{currency-code}',
        data?.paymentDetails?.currency || defaultCurrency
      ),
      width: gridColumnWidths.unitPriceFormatted,
    },
    {
      field: 'quantity',
      headerName: getDictionaryValueOrKey(config?.labels?.lineQuantity),
      cellRenderer: ({ data }) => (
        <QuantityColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.quantity,
    },
    {
      field: 'totalPriceFormatted',
      headerName: getDictionaryValueOrKey(
        config?.labels?.lineTotalPrice
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
        <ActionsColumn line={data} config={gridProps} />
      ),
      width: gridColumnWidths.actions,
    },
  ];

  const myColumnDefs = useMemo(
    () => buildColumnDefinitions(columnDefinitionsOverride),
    []
  );
  const contextMenuItems = (params) =>
    getContextMenuItems(myColumnDefs, config?.labels);

  useEffect(() => {
    window.getSessionInfo &&
      window.getSessionInfo().then((data) => {
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
        contextMenuItems={contextMenuItems}
      />
    </section>
  );
}

export default OrdersTrackingDetailGrid;
