import { usPost } from "../../../../utils/api";
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
                    refinementGroups,
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
        SortBy: `${sortModel?.[0]?.colId ?? "id"} ${sortModel?.[0]?.sort ?? ""}${sortModel?.[1] ? "," : ""
            } ${sortModel?.[1]?.colId ?? ""} ${sortModel?.[1]?.sort ?? ""}`,
        SortDirection: sortModel?.[0]?.sort ?? "",
    };
    const multiSorting =
        sortRenewalObjects(mappedResponse?.data?.content?.items, query) ?? 0;
    return [...multiSorting];
}

export function preserveFilteringOnPagination(customPaginationRef, request) {
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
        const { colId, sort } = hasSortChanged.current?.sortData;  
        const params = { ...optionFieldsRef.current, sortBy: [colId], sortDirection: sort };
        if (customPaginationRef.current?.pageNumber !== 1) {
          params.PageNumber = customPaginationRef.current?.pageNumber;
        }
        const result = await usPost(componentProp.uiServiceEndPoint, params);
        return result
      }
    return false
}

export function setPaginationData(mappedResponse) {
    const { pageCount, pageNumber, totalItems, items } = mappedResponse;
    return {
        currentResultsInPage: items.length,
        totalCounter: totalItems,
        pageCount,
        pageNumber: parseInt(pageNumber),
    };
}

export function decideGetPostStrategy(){

}