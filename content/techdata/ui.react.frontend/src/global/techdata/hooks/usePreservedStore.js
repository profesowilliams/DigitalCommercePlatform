import React from 'react';
export const usePreservedStore = (columnApiRef) => {
    const columnSorted = React.useRef({});
    function onSortChanged(event) {
        const cols = event?.columnApi?.getAllGridColumns()
            .map(({ colId, sort }) => ({ colId, sort }))
            .filter((col) => col.sort);
        if (!cols.length) return
        const [colSorted] = cols;
        const { colId = '', sort = '' } = colSorted;
        if (sort === 'desc' && colId === 'id') return
        columnSorted.current = { colId, sort };
    }
    async function sortPreservedState() {
        const { colId, sort } = columnSorted.current;
        columnApiRef.current.applyColumnState({
            state: [{colId,sort}],
            defaultState: { sort: null }
        })
    }
    return { onSortChanged, sortPreservedState }
}
