import { usGet, usPost } from "../../../../utils/api";
import { sortRenewalObjects } from "../../../../utils/utils";

export function mapServiceData(response) {
    const mappedResponse = { ...response };
    const items = mappedResponse?.data?.content?.items?.map((val) => ({
        ...val,
    }));
    const itemsWithActions = items
        ? items.map((data) => ({ ...data, actions: true }))
        : [];
    const totalItems = mappedResponse?.data?.content?.totalItems ?? items?.length;
    const pageCount = mappedResponse?.data?.content?.pageCount ?? 0;
    const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;
    const refinementGroups =
        mappedResponse?.data?.content?.refinementGroups ?? "thomas";

    if (mappedResponse.status !== 200 && !mappedResponse.data) {
        return {
            data: {
                content: {
                    items: null,
                    totalItems,
                    pageCount,
                    pageNumber,
                    refinementGroups                    
                },
            },
        };
    }

    mappedResponse.data.content = {
        items: itemsWithActions,
        totalItems,
        pageCount,
        pageNumber,
        refinementGroups,
    };
    return mappedResponse;
}

export function mapSortIdByPrice(secondLevelOptions, gridApiRef, request) {
    if (request.url.includes("SortBy=id")) {
        gridApiRef.current.columnApi.applyColumnState({
            state: [{ ...secondLevelOptions, sort: "asc" }],
            defaultState: { sort: null },
        });
        return true;
    }
    return false;
}

export function priceDescendingByDefaultHandle(sortingFields, mappedResponse) {
    const { dueDateKey, dueDateDir, secondLevelOptions } = sortingFields;

    const sortModel = [
        { colId: dueDateKey, sort: dueDateDir },
        { ...secondLevelOptions },
    ];
    const query = {
        SortBy: `${sortModel?.[0]?.colId ?? "id"}:${sortModel?.[0]?.sort ?? ""}${sortModel?.[1] ? "," : ""
            }${sortModel?.[1]?.colId ?? ""}:${sortModel?.[1]?.sort ?? ""}`
    };
    const multiSorting =
        sortRenewalObjects(mappedResponse?.data?.content?.items, query) ?? 0;
    return [...multiSorting];
}

export function addCurrentPageNumber(customPaginationRef, request) {
    const pageNumber = customPaginationRef.current?.pageNumber;
    if (pageNumber !== 1) {
        return request.url.replace(/PageNumber=\d+/, `PageNumber=${pageNumber}`);
    }
    return request.url;
}

export function isFilterPostRequest(hasSortChanged,isFilterDataPopulated){
    if (hasSortChanged.current && isFilterDataPopulated.current) {
        return true
    }
    return false
}

export async function preserveFilterinOnSorting({hasSortChanged,isFilterDataPopulated,optionFieldsRef,customPaginationRef,componentProp}){
    if (isFilterPostRequest(hasSortChanged,isFilterDataPopulated)) {
        const params = { ...optionFieldsRef.current, sortBy: hasSortChanged.current?.sortData.map(c => `${c.colId}:${c.sort ?? ''}`) };
        if (customPaginationRef.current?.pageNumber !== 1) {
          params.PageNumber = customPaginationRef.current?.pageNumber;
        }
        const result = await usPost(componentProp.uiServiceEndPoint, params);
        return result
      }
    return false
}
export async function nonFilteredOnSorting({request, hasSortChanged, searchCriteria}){
    var url = request.url.split('&');
    const sortParam = hasSortChanged.current?.sortData.map(c => `SortBy=${c.colId}:${c.sort ?? ''}`).join('&');
    url.splice(url.findIndex(e => e.indexOf('SortBy=') === 0), 1, sortParam);
    url.splice(url.findIndex(e => e.indexOf('SortDirection=') === 0),1);
    if (searchCriteria.current?.field) {
        const {field, value} = searchCriteria.current;
        url.push(`${field}=${value}`);
    }
    return await usGet(url.join('&'));
}

export function setPaginationData(mappedResponse,pageSize) {
    const { pageCount, pageNumber, totalItems } = mappedResponse;
    return {
        currentResultsInPage: pageSize,
        totalCounter: totalItems,
        pageCount,
        pageNumber: parseInt(pageNumber),
    };
}

export function decideGetPostStrategy(){

}

export function isFirstTimeSortParameters(sortingList,{colId}){
    if ( !sortingList ) return true;
    const { sortData } = sortingList;    
    //const sortData = [{colId:'dueDate',sort:'asc'}, {colId:'total',sort:'desc'}]
    const colIdList = sortData.map(s => s.colId);
    Object.defineProperty(colIdList, 'hasDefaultValues',{
        writable: false,
        value: function (compareList){
            const validArgs = [];
            for (const item of compareList){
                validArgs.push(this.includes(item))
            }
            return validArgs.every(sort => sort);
        }
    })
    return colIdList.hasDefaultValues(["dueDate",colId]);    
}

