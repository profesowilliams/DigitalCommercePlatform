import { endpoints, setDefaultDateRange } from '../../Utils/orderTrackingUtils';
import { sortSwap } from '../../../OrdersTrackingCommon/Utils/utils';

export function getFetchExportUrl(baseUrl, searchParams) {
  console.log('Utils::getFetchExportUrl');

  const requestUrl = new URL(`${baseUrl}${endpoints.exportAllOrderLines}`);

  if (searchParams?.paginationAndSorting) {
    if (searchParams.paginationAndSorting.sortBy) {
      requestUrl.searchParams.set('sortby', sortSwap(searchParams.paginationAndSorting.sortBy));
    }

    if (searchParams.paginationAndSorting.sortDirection) {
      requestUrl.searchParams.set('sortdirection', searchParams.paginationAndSorting.sortDirection);
    }

    if (searchParams.paginationAndSorting.pageNumber) {
      requestUrl.searchParams.set('pagenumber', searchParams.paginationAndSorting.pageNumber);
    }

    if (searchParams.paginationAndSorting.queryCacheKey) {
      requestUrl.searchParams.set('q', searchParams.paginationAndSorting.queryCacheKey);
    }
  }

  if (searchParams?.search?.field &&
    searchParams?.search?.value &&
    searchParams?.search?.gtmField) {
    requestUrl.searchParams.set('key', searchParams.search.field);
    requestUrl.searchParams.set('value', searchParams.search.value);
    requestUrl.searchParams.set('gtmfield', searchParams.search.gtmField);
  }

  if (searchParams?.filters?.types?.length > 0) {
    searchParams.filters.types.forEach((type) => {
      requestUrl.searchParams.append('type', type);
    });
  }

  if (searchParams?.filters?.statuses?.length > 0) {
    searchParams.filters.statuses.forEach((status) => {
      requestUrl.searchParams.append('status', status);
    });
  }

  setDefaultDateRange(requestUrl, searchParams);

  return requestUrl.href;
}