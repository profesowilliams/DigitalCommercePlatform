import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import Grid from "../../Grid/Grid";
// import QuantityColumn from "../Columns/QuantityColumn.jsx";
import columnDefs from './columnDefinitions';
import buildColumnDefinitions from "./buildColumnDefinitions";

import DescriptionColumn from '../Columns/DescriptionColumn'
// import UnitPriceColumn from "../Columns/UnitPriceColumn";
// import { getContextMenuItems, setLocalStorageData } from "../../RenewalsGrid/utils/renewalUtils";


function OrdersTrackingDetailGrid({ data, gridProps }) {
  const gridData = data.items ?? [];
  const gridConfig = {
    ...gridProps,
    columnList: columnDefs,
    serverSide: false,
    paginationStyle: "none",
  };
;

const gridColumnWidths = Object.freeze({
    actions: '100px',
    description: '191px',
    id: '66px',
    quantity: '40px',
    shipDate: '99px',
    status: '173x',
    totalPriceFormatted: '100px',
    unitPriceFormatted: '150px',
  });

  const columnDefinitionsOverride = [ 
    {
      field: "id",
      headerName: gridProps?.lineNo,
      width: gridColumnWidths.id,
    },
    {
      field: "description",
      headerName: gridProps?.lineDescription,
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
      headerName: gridProps?.lineStatus,
    //   valueGetter: ({ data }) =>
    //     data.product.find((p) => p.family)?.family ?? "N/A",
      width: gridColumnWidths.status,
    },
    {
      field: "shipDate",
      headerName: gridProps?.lineShipDate,
      cellRenderer: (props) => 'TBD', // Pending backend changes that are not ready yet
      width: gridColumnWidths.shipDate,
    },
    {
      field:'unitPriceFormatted',
      headerName: gridProps?.lineUnitPrice,
    //   headerName: gridProps.unitPrice?.replace(
    //     "{currency-code}",
    //     data?.currency || ""
    //   ),
    //   suppressKeyboardEvent: (params) => suppressNavigation(params),
    //   cellRenderer: (props) => {
    //     const isEditing = isEditingRef.current && data?.canEditResellerPrice;
    //     return UnitPriceColumn({...props, isEditing})
    //   },
      width: gridColumnWidths.unitPriceFormatted,
    },
    {
      field:'quantity',
      headerName: gridProps?.lineQuantity,
    //   cellRenderer: (props) =>{
    //     const isEditing = isEditingRef.current && data?.canEditQty;
    //     return QuantityColumn({ ...props, isEditing })
    //   },
      width: gridColumnWidths.quantity,     
    },
    {
      field:'totalPriceFormatted',
      headerName: gridProps?.lineTotalPrice,
    //   headerName: gridProps.totalPrice?.replace(
    //     "{currency-code}",
    //     data?.currency || ""
    //   ),
    //   cellRenderer: (props) => Price(props),
    //   valueGetter:'data.quantity * data.unitPrice',
    //   // Use sum aggFunc to also update subtotal value.
    //   // Function is triggered on internal grid updates.
    //   aggFunc: params => {
    //     let total = 0;
    //     params.values.forEach(value => total += value);
    //     setSubtotal(total);
    //     return total;
    //   },
      width: gridColumnWidths.totalPriceFormatted,
    }
  ];

  const myColumnDefs = useMemo(() => buildColumnDefinitions(columnDefinitionsOverride),[]); 

//   console.log('myColumnDefs',myColumnDefs)
//   console.log('columnDefinitionsOverride',columnDefinitionsOverride)

  //const contextMenuItems = (params) => getContextMenuItems(params, compProps);

  return (
    <div className="">
      <section>
        <Grid
          //onAfterGridInit={onAfterGridInit}
          columnDefinition={myColumnDefs}
          config={gridConfig}
          data={gridData}
          //getDefaultCopyValue={getDefaultCopyValue}
          //contextMenuItems={contextMenuItems}
        />
      </section>
    </div>
  );
}

export default OrdersTrackingDetailGrid;
