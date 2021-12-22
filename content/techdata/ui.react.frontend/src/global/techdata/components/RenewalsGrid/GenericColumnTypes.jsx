import React from "react";
import {
  getUserDataInitialState,
  hasAccess,
  IS_TD_INTERNAL,
  RENEWALS_TYPE,
} from "../../../../utils/user-utils";
import ContractColumn from "./ContractColumn";
import DueDateColumn from "./DueDateColumn";

const columnFieldsMap = (definition, eventProps) => {
  const { columnKey } = definition;
  const { value, data } = eventProps;
 
  const columnFields = {
    reseller: value?.name,
    endUser: value?.name,
    vendor: `${value?.name} : ${data?.programName}`,
    contract: <ContractColumn data={data} />,
    dueDateDays: <DueDateColumn columnDefinition={definition} columnValue={data?.dueDate}/>,
    price: (data?.items[0]?.unitPrice == 0 ? '0' : data?.items[0]?.unitPrice) ?? ""
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
  cellRenderer: ({ data }) => {
    return (
      <div>
        <i className="fa fa-plus-circle" aria-hidden="true"></i>
        <i className="fa fa-plus-square" aria-hidden="true"></i>
        <i className="fa fa-plus-triangle" aria-hidden="true"></i>
      </div>
    );
  },
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

export const plainResellerColumnFn = ({ columnLabel, columnKey, sortable }) => {
  // check if Its a reseller or techdata employee
  //refactor needed
  const isInternal =
    IS_TD_INTERNAL &&
    hasAccess({
      user: getUserDataInitialState(),
      accessType: RENEWALS_TYPE.resellerName,
    });
  // const testVariable = true;
  if (isInternal) {
    return {
      headerName: columnLabel,
      field: columnKey,
      sortable: sortable,
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
