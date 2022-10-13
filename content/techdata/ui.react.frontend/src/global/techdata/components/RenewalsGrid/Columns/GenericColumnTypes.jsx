import React from "react";
import {
  isHouseAccount
} from "../../../../../utils/user-utils";
import ContractColumn from "./ContractColumn";
import DueDateColumn from "./DueDateColumn";
import DueDateDayColumn from "./DueDateDayColumn";
import PriceColumn from "./PriceColumn";
import RenewalActionColumn from "./RenewalActionColumn";
import { useRenewalGridState } from "../store/RenewalsStore";
import Link from "../../Widgets/Link";


const columnFieldsMap = (definition, eventProps) => {
  const { detailUrl = "", displayCurrencyName = false } = useRenewalGridState((state) => state.aemConfig);
  const { columnKey } = definition;
  const { value, data } = eventProps;

  const renewalDetailsURL = encodeURI(
    `${window.location.origin}${detailUrl}.html?id=${data?.source?.id ?? ""}`
  );

  const columnFields = {
    resellername: data?.reseller?.name,
    endUser: value?.name,
    vendor: `${value?.name} : ${data?.programName}`,
    renewedduration: <ContractColumn data={data} eventProps={eventProps} />,
    dueDays: <DueDateDayColumn columnValue={data?.dueDays} />,
    dueDate: <DueDateColumn columnValue={data?.dueDate} />,
    total: <PriceColumn columnValue={data?.renewal?.total} currency={data?.renewal?.currency} displayCurrencyName={displayCurrencyName} />,
    agreementNumber: data?.agreementNumber,
    Id: (
      <Link
        href={renewalDetailsURL}
        variant="renewal-links__secondary"
        underline="hover"
      >
        {data.source.id}
      </Link>
    ),
  };
  const defaultValue = () => (typeof value !== "object" && value) || "";
  return columnFields[columnKey] || defaultValue();
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
  actions: 100
}

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
  Id: "150px",
  agreementNumber: "130px",
  renewedduration: "200.632px",
  dueDays: "143.737px",
  dueDate: "139.526px",
  total: "122.526px",
  actions: "100px",
};

/**
 * Adding columnkey to this list will enable the possibility to
 * show their value inside a tooltip on hover.
 */
const hoverableList = ["endUser", "vendor", "resellername", "renewedduration"];

function isHoverable(columnKey) {
  return {
    hoverable: hoverableList.includes(columnKey)
  }
}

export const plainTextColumn = (definition) => {
  const { columnLabel, columnKey, sortable = false } = definition;
  return {
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
    cellHeight: () => 45,
    minWidth: columnsMinWidth[columnKey] || null,
    width: columnsWidth[columnKey] || null,
    resizable: false, 
    cellRenderer: (eventProps) => columnFieldsMap(definition, eventProps),
    ...isHoverable(columnKey),
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
  minWidth: columnsMinWidth[columnKey] || null,
  width: columnsWidth[columnKey] || null,
  cellRenderer: (eventProps) => <RenewalActionColumn eventProps={eventProps} /> ,
});

export const plainResellerColumnFn = (definition) => {
  // check if Its a reseller or techdata employee
  const { columnLabel, columnKey, sortable } = definition;
  if (isHouseAccount()) {
    return {
      headerName: columnLabel,
      field: columnKey,
      sortable: sortable,
      resizable: false,
      minWidth: columnsMinWidth[columnKey] || null,
      width: columnsWidth[columnKey] || null,
      cellRenderer: (eventProps) => columnFieldsMap(definition, eventProps),
      ...isHoverable(columnKey),
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
