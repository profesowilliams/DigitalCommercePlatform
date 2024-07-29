import { usGet } from '../../../../../utils/api';
import { setDefaultSearchDateRange, } from '../../../../../utils/utils';
import { sortSwap } from '../../OrdersTrackingCommon/Utils/utils';

export const endpoints = {
  ordersReport: '/v3/OrderReport',
  ordersReportCount: '/v3/OrderReport/Count',
  exportAllOrderLines: '/v3/OrderExport',
  orderModify: '/v2/OrderModify',
  orders: '/v3/Orders',
  ordersCount: '/v3/Orders/Count',
  orderDetail: '/v3/OrderDetails',
  replaceProduct: '/v2/OrderEOL',
  replacementsProducts: '/v2/Product/Replacement',
  refinements: '/v3/Refinements'
};

export const filtersDateGroup = [
  'createdFrom',
  'createdTo',
  'etaDateFrom',
  'etaDateTo',
  'invoiceDateFrom',
  'invoiceDateTo',
  'shippedDateFrom',
  'shippedDateTo',
];

export const setDefaultDateRange = (requestUrl, searchParams) => {
  console.log('Utils::setDefaultDateRange');
  let isDefaultDateCriteria = false;
  let from;
  let to;
  let dateFromParam = 'createdFrom';
  let dateToParam = 'createdTo';

  if (searchParams.filters?.date?.type && searchParams.filters?.date?.from && searchParams.filters?.date?.to) {
    const type = searchParams.filters.date.type;
    if (type == 'orderDate') {
      dateFromParam = 'createdFrom';
      dateToParam = 'createdTo';
    } else if (type == 'shipDate') {
      dateFromParam = 'shippedDateFrom';
      dateToParam = 'shippedDateTo';
    } else if (type == 'etaDate') {
      dateFromParam = 'etaDateFrom';
      dateToParam = 'etaDateTo';
    } else if (type == 'invoiceDate') {
      dateFromParam = 'invoiceDateFrom';
      dateToParam = 'invoiceDateTo';
    }

    from = searchParams.filters.date.from;
    to = searchParams.filters.date.to;
  } else if (searchParams.filters?.types?.length > 0 || searchParams.filters?.statuses?.length > 0) {
    const defaultDate90 = setDefaultSearchDateRange(90);
    from = defaultDate90.from;
    to = defaultDate90.to;
    isDefaultDateCriteria = true;
  } else if (!searchParams.search?.value && !searchParams.reports?.value) {
    const defaultDate30 = setDefaultSearchDateRange(30);
    from = defaultDate30.from;
    to = defaultDate30.to;
    isDefaultDateCriteria = true;
  }

  if (from && to) {
    requestUrl.searchParams.set(dateFromParam, from);
    requestUrl.searchParams.set(dateToParam, to);
  }

  if (isDefaultDateCriteria) {
    requestUrl.searchParams.set('ignoreInCache', 'CreatedDate');
  }
};

export const fetchOrdersCount = async (baseUrl, searchParams) => {
  console.log('Utils::fetchOrdersCount');

  const url = searchParams.reports?.value
    ? endpoints.ordersReportCount
    : endpoints.ordersCount;

  const requestUrl = new URL(`${baseUrl}${url}`);
  if (searchParams.reports?.value) {
    requestUrl.searchParams.set('reportName', searchParams.reports.value);
  }

  if (searchParams.search?.field && searchParams.search?.value) {
    requestUrl.searchParams.set('key', searchParams.search.field);
    requestUrl.searchParams.set('value', searchParams.search.value);
  }

  if (searchParams.filters?.types?.length > 0) {
    searchParams.filters.types.forEach((type) => {
      requestUrl.searchParams.append('type', type);
    });
  }

  if (searchParams.filters?.statuses?.length > 0) {
    searchParams.filters.statuses.forEach((status) => {
      requestUrl.searchParams.append('status', status);
    });
  }

  setDefaultDateRange(requestUrl, searchParams);

  try {
    console.log('Utils::fetchOrdersCount::url=' + requestUrl.href);
    const result = await usGet(requestUrl.href);
    return result;
  } catch (error) {
    console.error('Utils::fetchOrdersCount::error on orders count >>', error);
    return {
      error: { isError: true },
    };
  }
};

export async function fetchData(baseUrl, searchParams) {
  return searchParams.reports?.value
    ? fetchReport(baseUrl, searchParams)
    : fetchSearchData(baseUrl, searchParams);
}

async function fetchSearchData(baseUrl, searchParams) {
  console.log('Utils::fetchSearchData');

  const requestUrl = new URL(`${baseUrl}${endpoints.orders}`);

  if (searchParams.paginationAndSorting) {
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

  if (searchParams.search?.field &&
    searchParams.search?.value &&
    searchParams.search?.gtmField) {
    requestUrl.searchParams.set('key', searchParams.search.field);
    requestUrl.searchParams.set('value', searchParams.search.value);
    requestUrl.searchParams.set('gtmfield', searchParams.search.gtmField);
  }

  if (searchParams.filters?.types?.length > 0) {
    searchParams.filters.types.forEach((type) => {
      requestUrl.searchParams.append('type', type);
    });
  }

  if (searchParams.filters?.statuses?.length > 0) {
    searchParams.filters.statuses.forEach((status) => {
      requestUrl.searchParams.append('status', status);
    });
  }

  setDefaultDateRange(requestUrl, searchParams);

  try {
    console.log('Utils::fetchSearchData:url=' + requestUrl.href);
    const result = await usGet(requestUrl.href);
    return result;
  } catch (error) {
    console.error('Utils::fetchSearchData::error on orders tracking grid >>', error);
  }
}

export async function fetchReport(baseUrl, searchParams) {
  console.log('Utils::fetchReport');

  const requestUrl = new URL(`${baseUrl}${endpoints.ordersReport}`);

  requestUrl.searchParams.set('ReportName', searchParams.reports.value);

  if (searchParams.paginationAndSorting) {
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

  try {
    console.log('Utils::fetchReport::url=' + requestUrl.href);
    const result = await usGet(requestUrl.href);
    return result;
  } catch (error) {
    console.error('Utils::fetchReport::error on fetch report >>', error);
  }
}

export async function fetchOrderLinesData(baseUrl, id) {
  console.log('Utils::fetchOrderLinesData');
  try {
    const result = await usGet(
      `${baseUrl}/v3/orderdetails/${id}/lines`
    );
    return result;
  } catch (error) {
    console.error('Utils::fetchOrderLinesData::error', error);
    return null;
  }
}

export function setPaginationData(response, responseContent, pageSize = 25) {
  const pageCount = Math.ceil(response?.totalItems / pageSize);
  return {
    currentResultsInPage: pageSize,
    totalCounter: response?.totalItems,
    pageCount,
    pageNumber: parseInt(responseContent?.pageNumber) || 1,
    queryCacheKey: responseContent?.queryCacheKey,
  };
}