import React from "react";
import {
  isInternalUser
} from "../../../../utils/user-utils";
import ContractColumn from "./ContractColumn";
import DueDateColumn from "./DueDateColumn";
import DueDateDayColumn from "./DueDateDayColumn";
import PriceColumn from "./PriceColumn";
import RenewalActionColumn from "./RenewalActionColumn";

const columnFieldsMap = (definition, eventProps) => {
  const { columnKey } = definition;
  const { value, data } = eventProps;
  const columnFields = {
    resellername: data?.reseller?.name,
    endUser: value?.name,
    vendor: `${value?.name} : ${data?.programName}`,
    renewedduration: <ContractColumn data={data} eventProps={eventProps} />,
    dueDays: <DueDateDayColumn columnValue={data?.dueDate} />,
    dueDate: <DueDateColumn columnValue={data?.dueDate} />,
    total: <PriceColumn columnValue={data?.renewal?.total} />,
    agreementNumber: data?.agreementNumber
  };
  const defaultValue = () => (typeof value !== "object" && value) || "";
  return columnFields[columnKey] || defaultValue();
};

export const dateColumn = ({ columnLabel, columnKey, sortable = false }) => ({
  headerName: columnLabel,
  field: columnKey,
  sortable: sortable,
  width: columnsWidth[columnKey] || null,
  valueFormatter: (props) => {
    return getDateTransformed(props.value);
  },
});

const getDateTransformed = (dateUTC) => {
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  const dateValue = new Date(dateUTC);

  return isValidDate(dateValue) ? dateValue.toLocaleDateString() : dateUTC;
};

const columnsWidth = {
  resellername: "173.368px",
  endUser: "123.368px",
  vendor: "177.632px",
  agreementNumber: "120.211px",
  renewedduration: "177.632px",
  dueDays: "143.737px",
  dueDate: "109.526px",
  total: "109.526px",
  actions: "100px",
};

export const plainTextColumn = (definition) => {
  const { columnLabel, columnKey, sortable = false } = definition;
  return {
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
    cellHeight: () => 45,    
    width: columnsWidth[columnKey] || null,
    resizable: false,
    cellRenderer: (eventProps) => columnFieldsMap(definition, eventProps),
  };
};

export const buttonListColumn = ({
  columnLabel,
  columnKey,
  sortable = false,
}) => ({
  headerName: columnLabel,
  field: columnKey,
  sortable: sortable,
  width: columnsWidth[columnKey] || null,
  cellRenderer: (eventProps) => <RenewalActionColumn eventProps={eventProps} /> ,
});

export const plainResellerColumnFn = (definition) => {
  // check if Its a reseller or techdata employee
  const { columnLabel, columnKey, sortable } = definition;
  if (isInternalUser) {
    return {
      headerName: columnLabel,
      field: columnKey,
      sortable: sortable,
      resizable: false,
      width: columnsWidth[columnKey] || null,
      cellRenderer: (eventProps) => columnFieldsMap(definition, eventProps)
    };
  } else {
    return null;
  }
};

const columnTypes = {
  date: dateColumn,
  plainText: plainTextColumn,
  buttonList: buttonListColumn,
  plainResellerColumn: plainResellerColumnFn,
};

export const getColumnDefinitions = (originalDefinitions) => {
  const colDefs = originalDefinitions.map((definition) => {
    return columnTypes[definition.type](definition);
  });
  const res = colDefs.filter((columnDef) => columnDef !== null);
  return res;
};
