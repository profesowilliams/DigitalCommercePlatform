import React from 'react';
import Link from '../../Widgets/Link';
import ContractColumn from '../Columns/ContractColumn';
import DistiQuoteColumn from '../Columns/DistiQuoteColumn';
import DueDateColumn from '../Columns/DueDateColumn';
import DueDateDayColumn from '../Columns/DueDateDayColumn';
import PriceColumn from '../Columns/PriceColumn';
import RenewalActionColumn from '../Columns/RenewalActionColumn';
import Tooltip from '../../web-components/Tooltip';
import { InfoIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

export const renewalsDefinitions = (componentProp) => {
  const handleMouseOver = (event) => {
    const target = event.currentTarget;
    const closestRow = target.closest('.ag-row');

    if (closestRow) {
      closestRow.style.zIndex = '10'; // Add z-index inline style
    } else {
      console.log('No ag-row found for the hovered element.');
    }
  };

  const handleMouseLeave = (event) => {
    const target =
      event?.currentTarget || document.querySelector('.cmp-renewals-ellipsis');
    const closestRow = target?.closest('.ag-row');

    if (closestRow) {
      closestRow.style.zIndex = ''; // Remove the z-index inline style
    } else {
      console.log('No ag-row found for the element.');
    }
  };

  const renderPriceColumn = (componentProp, data) => {
    if (componentProp.enableRequestQuote && data.canRequestQuote) {
      return <span className="non-request-quote">-</span>;
    } else if (
      componentProp.enableRequestQuote &&
      data?.formattedQuoteRequestedTime
    ) {
      return (
        <span className="requested-quote">
          {getDictionaryValueOrKey(
            componentProp.requestQuote.requestedQuoteHeading
          )}
          <Tooltip
            text={`<p style="font-size: 12px; line-height: 18px"><b>${getDictionaryValueOrKey(
              componentProp.requestQuote.toolTipHeading
            )}</b><br/><span style="font-size: 12px; line-height: 18px; display: block;">${getDictionaryValueOrKey(
              componentProp.requestQuote.timeStampRequested
            )}:${data?.formattedQuoteRequestedTime}</span>
                <p style="font-size: 16px; line-height: 21px">${getDictionaryValueOrKey(
                  componentProp.requestQuote.toolTipSuccessMessage
                )}</p>
              </p>`}
            type="html"
            hide
            arrow={true}
            placement="bottom"
          >
            <InfoIcon
              width="16"
              height="16"
              onMouseOver={handleMouseOver} 
              onMouseLeave={handleMouseLeave} 
            />
          </Tooltip>
        </span>
      );
    } else {
      return (
        <PriceColumn
          columnValue={data?.renewal?.total}
          currency={data?.renewal?.currency}
        />
      );
    }
  };

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
      actions: (
        <RenewalActionColumn eventProps={eventProps} config={componentProp} />
      ),
      total: renderPriceColumn(componentProp, data),
      agreementNumber:
        data?.agreementNumber === 'Multiple'
          ? componentProp?.productGrid?.multipleLabel
          : data?.agreementNumber,
      Id: <DistiQuoteColumn id={data?.source?.id} type={data?.source?.type} />,
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
    dueDate: 110,
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
    dueDate: '122.526px',
    total: '110.526px',
    actions: '100px',
  };

  const hoverableList = [
    'endUser',
    'vendor',
    'resellername',
    'renewedduration',
  ];

  const fieldsWithCellStyle = ['Id', 'total'];

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
