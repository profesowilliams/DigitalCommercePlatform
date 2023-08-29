import React from 'react';
import ActionColumn from '../Columns/ActionsColumn';
import DescriptionColumn from '../Columns/DescriptionColumn';
import LineNumberColumn from '../Columns/LineNumberColumn';
import QuantityColumn from '../Columns/QuantityColumn';
import ShiptDateColumn from '../Columns/ShipDateColumn';
import StatusColumn from '../Columns/StatusColumn';
import TotalColumn from '../Columns/TotalColumn';
import UnitCostColumn from '../Columns/UnitCostColumn';

export const ordersTrackingDefinition = ({ detailUrl, multiple }) => {
  const createColumnComponent = (eventProps, aemDefinition) => {
    const { columnKey } = aemDefinition;
    const { value, data } = eventProps;
    const columnComponents = {
      actions: <ActionColumn />,
      description: <DescriptionColumn data={data} />,
      id: <LineNumberColumn data={data} />,
      quantity: <QuantityColumn data={data} />,
      xxxxxxxxx: <ShiptDateColumn data={data} />,
      status: <StatusColumn data={data} />,
      totalPriceFormatted: <TotalColumn data={data} />,
      unitPriceFormatted: <UnitCostColumn data={data} />,
    };
    const defaultValue = () => (typeof value !== 'object' && value) || '';
    return columnComponents[columnKey] || defaultValue();
  };

  const columnsMinWidth = {
    actions: 100,
    description: 191,
    id: 66,
    quantity: 20,
    xxxxxxxxx: 99,
    status: 173,
    totalPriceFormatted: 100,
    unitPriceFormatted: 150,
  };

  const columnsWidth = {
    actions: '100px',
    description: '191px',
    id: '66px',
    quantity: '20px',
    xxxxxxxxx: '99px',
    status: '173x',
    totalPriceFormatted: '100px',
    unitPriceFormatted: '150px',
  };

  const hoverableList = [
    'description',
  ];

  const fieldsWithCellStyle = ['description'];

  const cellStyle = {
    'text-overflow': 'initial',
    'white-space': 'nowrap',
    overflow: 'visible',
    padding: 0,
  };

  const columnOverrides = (aemDefinition) => ({
    hoverable: hoverableList.includes(aemDefinition?.columnKey),
    ...(aemDefinition?.type === 'plainText' ? { cellHeight: () => 45 } : {}),
    minWidth: columnsMinWidth[aemDefinition?.columnKey] || null,
    width: columnsWidth[aemDefinition?.columnKey] || null,
    resizable: false,
    ...(fieldsWithCellStyle.includes(aemDefinition?.columnKey)
      ? { cellStyle }
      : {}),
  });

  return {
    columnOverrides,
    createColumnComponent,
  };
};
