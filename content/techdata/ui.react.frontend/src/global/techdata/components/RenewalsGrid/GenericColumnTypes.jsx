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
    sortable: sortable
})

const columnTypes = {
    "date": dateColumn,
    "plainText": plainTextColumn,
    "buttonList": plainTextColumn
}

export const getColumnDefinitions = (originalDefinitions) => {
    return originalDefinitions.map((definition) => {
        console.log(definition.type, columnTypes[definition.type], columnTypes)
        return columnTypes[definition.type](definition);
    });
}
