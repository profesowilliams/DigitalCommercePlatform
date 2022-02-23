import React from "react";
import {
  getUserDataInitialState,
  hasAccess,
  isInternalUser,
  RENEWALS_TYPE,
} from "../../../../utils/user-utils";
import { thousandSeparator } from "../../helpers/formatting";
import ContractColumn from "./ContractColumn";
import DueDateColumn from "./DueDateColumn";
import DueDateDayColumn from "./DueDateDayColumn";
import DropdownDownloadList from "./DropdownDownloadList";
import PriceColumn from "./PriceColumn";

const columnFieldsMap = (definition, eventProps) => {
  const { columnKey } = definition;
  const { value, data } = eventProps;
  const columnFields = {
    resellername: data?.reseller?.name,
    endUser: value?.name,
    vendor: `${value?.name} : ${data?.programName}`,
    renewedduration: <ContractColumn data={data} />,
    dueDays: <DueDateDayColumn columnValue={data?.dueDate} />,
    dueDate: <DueDateColumn columnValue={data?.dueDate} />,
    total: <PriceColumn columnValue={data?.renewal} />,
    agreementnumber: data?.agreementNumber 
  };
  const defaultValue = () => (typeof value !== "object" && value) || "";
  return columnFields[columnKey] || defaultValue();
};

export const dateColumn = ({ columnLabel, columnKey, sortable = false }) => ({
  headerName: columnLabel,
  field: columnKey,
  sortable: sortable,
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

const columnsWidth  = {
  "renewedduration" : "250px",
  "vendor": "250px",
  "dueDays": "190px"
}

export const plainTextColumn = (definition) => {
  const { columnLabel, columnKey, sortable = false } = definition;
  return {
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
    cellHeight: () => 45,    
    width: columnsWidth[columnKey] || null,
    resizable: true,
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
  expandable:true,
  valueFormatter: () => "",
  detailRenderer: ({ data }) => (
    <DropdownDownloadList data={data}  />
  ),
});

export const renewalPlanColumn = ({
  columnLabel,
  columnKey,
  sortable = false,
}) => ({
  headerName: columnLabel,
  field: columnKey,
  sortable: sortable,
  // expandable: true,
  resizable: true,
  width:"300px",
  cellRenderer: ({data}) => {     
    return <ContractColumn data={data} />
  },
  // detailRenderer: ({ data }) => {
  //   return <div>Custom Renewals Plan Row Details</div>;
  // },
});

export const plainResellerColumnFn = (definition) => {
  // check if Its a reseller or techdata employee
  //refactor needed
  const { columnLabel, columnKey, sortable } = definition;
  if (isInternalUser) {
    return {
      headerName: columnLabel,
      field: columnKey,
      sortable: sortable,
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
  renewalPlan: renewalPlanColumn,
  plainResellerColumn: plainResellerColumnFn,
};

export const getColumnDefinitions = (originalDefinitions) => {
  const colDefs = originalDefinitions.map((definition) => {
    return columnTypes[definition.type](definition);
  });
  const res = colDefs.filter((columnDef) => columnDef !== null);
  return res;
};
