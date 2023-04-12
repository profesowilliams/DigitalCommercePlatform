import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import Grid from "../../Grid/Grid";
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from "./buildColumnDefinitions";
import DescriptionColumn from '../Columns/DescriptionColumn'
import ActionsColumn from '../Columns/ActionsColumn'
import QuantityColumn from '../Columns/QuantityColumn'
import ShipDateColumn from '../Columns/ShipDateColumn'
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { getContextMenuItems } from "../../RenewalsGrid/utils/renewalUtils";

function OrdersTrackingDetailGrid({ data, gridProps }) {
  const gridData = data.items ?? [];
  const config = {
    ...gridProps,
    columnList: columnDefs,
    serverSide: false,
    paginationStyle: "none",
  };

const gridColumnWidths = Object.freeze({
    actions: '50px',
    description: '191px',
    id: '66px',
    quantity: '100px',
    shipDate: '99px',
    status: '173x',
    totalPriceFormatted: '100px',
    unitPriceFormatted: '150px',
  });

  const columnDefinitionsOverride = [ 
    {
      field: "id",
      headerName: getDictionaryValueOrKey(config?.labels?.lineNo),
      width: gridColumnWidths.id,
    },
    {
      field: "description",
      headerName: getDictionaryValueOrKey(config?.labels?.lineDescription),
      cellHeight: () => 80,
      cellRenderer: ({ data }) => (
        <DescriptionColumn
          line={data}
          config={gridProps}
        />
      ),
      width: gridColumnWidths.description,
    },
    {
      field: "status",
      headerName: getDictionaryValueOrKey(config?.labels?.lineStatus),
      width: gridColumnWidths.status,
    },
    {
      field: "shipDate",
      headerName: getDictionaryValueOrKey(config?.labels?.lineShipDate),
      cellRenderer: ({ data }) => (
        <ShipDateColumn
          line={data}
          config={gridProps}
        />),
      width: gridColumnWidths.shipDate,
    },
    {
      field:'unitPriceFormatted',
      headerName: getDictionaryValueOrKey(config?.labels?.lineUnitPrice),
    //   headerName: gridProps.unitPrice?.replace(
    //     "{currency-code}",
    //     data?.currency || ""
    //   ),
      width: gridColumnWidths.unitPriceFormatted,
    },
    {
      field:'quantity',
      headerName: getDictionaryValueOrKey(config?.labels?.lineQuantity),
      cellRenderer: ({ data }) => (
        <QuantityColumn
          line={data}
          config={gridProps}
        />),
      width: gridColumnWidths.quantity,     
    },
    {
      field:'totalPriceFormatted',
      headerName: getDictionaryValueOrKey(config?.labels?.lineTotalPrice),
    //   headerName: gridProps.totalPrice?.replace(
    //     "{currency-code}",
    //     data?.currency || ""
    //   ),
      width: gridColumnWidths.totalPriceFormatted,
    },
    {
      field: "actions",
      headerName: "",
      cellRenderer: ({ data }) => (
        <ActionsColumn
          line={data}
          config={gridProps}
        />
      ),
      width: gridColumnWidths.actions,
    },
  ];

  const myColumnDefs = useMemo(() => buildColumnDefinitions(columnDefinitionsOverride),[]); 
  const contextMenuItems = (params) => getContextMenuItems(myColumnDefs, config?.labels);

  return (
    <div className="">
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
    </div>
  );
}

export default OrdersTrackingDetailGrid;
