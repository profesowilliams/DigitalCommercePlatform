import React from "react";
import Link from '../../Widgets/Link';
import ContractColumn from '../Columns/ContractColumn';
import DistiQuoteColumn from "../Columns/DistiQuoteColumn";
import DueDateColumn from '../Columns/DueDateColumn';
import DueDateDayColumn from '../Columns/DueDateDayColumn';
import PriceColumn from '../Columns/PriceColumn';
import RenewalActionColumn from "../Columns/RenewalActionColumn";
import {
    EnterArrowIcon
} from '../../../../../fluentIcons/FluentIcons';

export const renewalsDefinitions = (componentProp, triggerRequestFlyout) => {

  const createColumnComponent = (eventProps, aemDefinition) => {  
    const { columnKey } = aemDefinition;
    const { value, data } = eventProps;
    const columnComponents = {
      resellername: data?.reseller?.name,
      endUser: value?.name,
      vendor: `${value?.name} : ${data?.programName}`,
      renewedduration: <ContractColumn data={data} eventProps={eventProps} />,
      dueDays: <DueDateDayColumn columnValue={data?.dueDays} />,
      dueDate: <DueDateColumn columnValue={data?.formattedDueDate} />,
      actions: <RenewalActionColumn eventProps={eventProps} />,
      total: (componentProp.enableRequestQuote && data.canRequestQuote) ? <span className='request-quote' onClick={ () => triggerRequestFlyout(data)}><EnterArrowIcon />Request Quote</span> : <PriceColumn columnValue={data?.renewal?.total} currency={data?.renewal?.currency} />,
      agreementNumber: data?.agreementNumber === 'Multiple' ? componentProp?.productGrid?.multipleLabel : data?.agreementNumber,
      Id: <DistiQuoteColumn id={data?.source?.id} />,
    };
    const defaultValue = () => (typeof value !== 'object' && value) || '';
    return columnComponents[columnKey] || defaultValue();
  };

  const columnsMinWidth = {
    resellername: 154,
    endUser: 151,
    vendor: 195,
    Id: 139,
    agreementNumber: 148,
    renewedduration: 186,
    dueDays: 127,
    dueDate: 115,
    total: 131,
    actions: 100,
  };

  const columnsWidth = {
    resellername: '173.368px',
    endUser: '123.368px',
    vendor: '177.632px',
    Id: '150px',
    agreementNumber: '130px',
    renewedduration: '200.632px',
    dueDays: '143.737px',
    dueDate: '139.526px',
    total: '122.526px',
    actions: '100px',
  };

  const hoverableList = [
    'endUser',
    'vendor',
    'resellername',
    'renewedduration',
  ];

  const fieldsWithCellStyle = ['Id', 'total'];

  const cellStyle = {'text-overflow':'initial','white-space':'nowrap', 'overflow': 'visible', 'padding': 0};

  const columnOverrides = aemDefinition => ({
    hoverable: hoverableList.includes(aemDefinition?.columnKey),
    ...(aemDefinition?.type === 'plainText' ? { cellHeight: () => 45 } : {}),
    minWidth: columnsMinWidth[aemDefinition?.columnKey] || null,
    width: columnsWidth[aemDefinition?.columnKey] || null,
    resizable: false, 
    ...(fieldsWithCellStyle.includes(aemDefinition?.columnKey) ? {cellStyle} : {})
  });

  return {
    columnOverrides,
    createColumnComponent,
  };
};