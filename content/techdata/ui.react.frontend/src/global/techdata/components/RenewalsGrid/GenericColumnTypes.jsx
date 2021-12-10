
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
    "buttonList": plainTextColumn,
    "plainResellerColumn": plainResellerColumnFn
}

export const getColumnDefinitions = (originalDefinitions) => {
    const colDefs = originalDefinitions.map((definition) => {
        console.log(definition.type, columnTypes[definition.type], columnTypes)
        return columnTypes[definition.type](definition);
    });
    return colDefs.filter(columnDef => columnDef !== null)
}

