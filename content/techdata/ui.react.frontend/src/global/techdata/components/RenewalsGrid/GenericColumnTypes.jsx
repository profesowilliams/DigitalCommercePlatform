import React from "react";
import { hasAccess, getUserDataInitialState, RENEWALS_TYPE } from "../../../../utils/user-utils";


export const dateColumn = ({ columnLabel, columnKey, sortable = false }) => (
{
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
    valueFormatter: (props) => {
        return getDateTransformed(props.value);
    },
})

const getDateTransformed = (dateUTC) => {
    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    const dateValue = new Date(dateUTC);

    return isValidDate(dateValue) ? dateValue.toLocaleDateString() : dateUTC;
};

export const plainTextColumn = ({ columnLabel, columnKey, sortable = false }) => (
{
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
})

export const buttonListColumn = ({ columnLabel, columnKey, sortable = false }) => (
{
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
    )},
})

export const renewalPlanColumn = ({ columnLabel, columnKey, sortable = false }) => (
{
    headerName: columnLabel,
    field: columnKey,
    sortable: sortable,
    expandable: true,
    rowClass: ({ node, data }) => {
      return `cmp-renewals_plan`;
    },
    detailRenderer: ({ data }) => {
      return (
        <div>
          Custom Renewals Plan Row Details
        </div>
    )},
})

export const plainResellerColumnFn = ({ columnLabel, columnKey, sortable}) => {
    // check if Its a reseller or techdata employee
    //refactor needed
    const testVariable = false;
    if (testVariable) {
        return { 
            headerName: columnLabel,
            field: columnKey,
            sortable: sortable,
        }
    } else {
        return null;
    }
}

const columnTypes = {
    "date": dateColumn,
    "plainText": plainTextColumn,
    "buttonList": buttonListColumn,
    "renewalPlan": renewalPlanColumn,
    "plainResellerColumn": plainResellerColumnFn
}

export const getColumnDefinitions = (originalDefinitions) => {
    const colDefs = originalDefinitions.map((definition) => {
        console.log(definition.type, columnTypes[definition.type], columnTypes)
        return columnTypes[definition.type](definition);
    });
    return colDefs.filter(columnDef => columnDef !== null);
}

export const filterColumnByEntitlementandHeaderName = ({ column, headerName, accessType }) => {
    const _headerName = headerName ? headerName : RENEWALS_TYPE.resellerName;
    return column.headerName === _headerName && hasAccess({ user: getUserDataInitialState(), accessType: accessType || null });
}
