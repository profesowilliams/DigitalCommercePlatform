import columnDefs from "./columnDefinitions";

function buildColumnDefinitions(columnDefsOverrideList) {
    const mapped = new Map(columnDefs.map(c => [c.field,{...c}]))    
    for (const newColumn of columnDefsOverrideList) {
        mapped.set(newColumn.field,{...mapped.get(newColumn.field), ...newColumn});
    }
    return [...mapped.values()];
}

export default buildColumnDefinitions;
