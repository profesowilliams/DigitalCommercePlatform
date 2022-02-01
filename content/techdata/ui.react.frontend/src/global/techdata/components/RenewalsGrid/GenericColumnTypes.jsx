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

const columnFieldsMap = (definition, eventProps) => {
  const { columnKey } = definition;
  const { value, data } = eventProps;
  const columnFields = {
    resellername: data?.reseller?.name,
    endUser: value?.name,
    vendor: `${value?.name} : ${data?.programName}`,
    renewedduration: <ContractColumn data={data} />,
    dueDays: <DueDateDayColumn columnValue={data?.dueDate} />,
    duedate: <DueDateColumn columnValue={data?.dueDate} />,
    price: thousandSeparator(value),
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

export const plainTextColumn = (definition) => {
  const { columnLabel, columnKey, sortable = false } = definition;
  return {
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
    width: columnKey == "vendor" ? "300px" : null,
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
  expandable: true,
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
  expandable: true,
  rowClass: ({ node, data }) => {
    return `cmp-renewals_plan`;
  },
  detailRenderer: ({ data }) => {
    return <div>Custom Renewals Plan Row Details</div>;
  },
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
    // console.log(definition.type, columnTypes[definition.type], columnTypes)
    return columnTypes[definition.type](definition);
  });
  const res = colDefs.filter((columnDef) => columnDef !== null);
  return res;
};
