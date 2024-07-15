import { usGet } from '../../../../../utils/api';
import { setDefaultSearchDateRange, } from '../../../../../utils/utils';

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

export const setSearchCriteriaDefaultDateRange = ({
  searchCriteria,
  requestUrl,
  filtersRefs,
  reportValue = null,
}) => {
  console.log('Utils::setSearchCriteriaDefaultDateRange');
  const { field, value } = searchCriteria?.current || {};

  let isDefaultDateCriteria = false;
  let from;
  let to;
  let dateFromParam = 'createdFrom';
  let dateToParam = 'createdTo';

  if (filtersRefs.current.date?.type && filtersRefs.current.date?.from && filtersRefs.current.date?.to) {
    const type = filtersRefs.current.date.type;
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

    from = filtersRefs.current.date.from;
    to = filtersRefs.current.date.to;
  } else if (filtersRefs?.current.types || filtersRefs?.current.statuses) {
    const defaultDate90 = setDefaultSearchDateRange(90);
    from = defaultDate90.from;
    to = defaultDate90.to;
    isDefaultDateCriteria = true;
  } else if (!field && !reportValue) {
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

export const fetchOrdersCount = async (
  baseUrl,
  filtersRefs,
  reportValue = null,
  searchCriteria
) => {
  console.log('Utils::fetchOrdersCount');

  const url = reportValue
    ? endpoints.ordersReportCount
    : endpoints.ordersCount;

  const requestUrl = new URL(`${baseUrl}${url}`);
  if (reportValue) {
    requestUrl.searchParams.set('reportName', reportValue);
  }

  if (searchCriteria.current?.field) {
    const { field, value } = searchCriteria.current;
    requestUrl.searchParams.set('key', field);
    requestUrl.searchParams.set('value', value);
  }

  if (filtersRefs.current.types?.length > 0) {
    filtersRefs.current.types.forEach((type) => {
      requestUrl.searchParams.append('type', type);
    });
  }

  if (filtersRefs.current.statuses?.length > 0) {
    filtersRefs.current.statuses.forEach((status) => {
      requestUrl.searchParams.append('status', status);
    });
  }

  setSearchCriteriaDefaultDateRange({
    searchCriteria,
    requestUrl,
    filtersRefs,
    reportValue,
  });

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

export async function fetchReport(
  baseUrl,
  paginationAndSorting,
  reportName
) {
  console.log('Utils::fetchReport');

  const requestUrl = new URL(`${baseUrl}${endpoints.ordersReport}`);

  requestUrl.searchParams.set('ReportName', reportName);

  if (paginationAndSorting?.current) {
    requestUrl.searchParams.set('pagenumber', paginationAndSorting.current.pageNumber);
    requestUrl.searchParams.set('q', paginationAndSorting.current.queryCacheKey);
  }

  if (paginationAndSorting?.current) {
    requestUrl.searchParams.set('sortdirection', paginationAndSorting.current.sortDirection);
    requestUrl.searchParams.set('sortby', sortSwap(paginationAndSorting.current.sortBy));
  }

  try {
    console.log('Utils::fetchReport::url=' + requestUrl.href);
    const result = await usGet(requestUrl.href);
    return result;
  } catch (error) {
    console.error('Utils::fetchReport::error on fetch report >>', error);
  }
}

const sortSwap = (swapValue) => {
  switch (swapValue) {
    case 'reseller':
      return 'CustomerPO';
    case 'shipTo.name':
      return 'ShipTo';
    default:
      return swapValue;
  }
};

export async function fetchData(
  baseUrl,
  paginationAndSorting,
  searchCriteria,
  filtersRefs) {
  console.log('Utils::fetchData');

  const requestUrl = new URL(`${baseUrl}${endpoints.orders}`);

  if (paginationAndSorting?.current) {
    requestUrl.searchParams.set('pagenumber', paginationAndSorting.current.pageNumber);
    requestUrl.searchParams.set('sortdirection', paginationAndSorting.current.sortDirection);
    requestUrl.searchParams.set('sortby', sortSwap(paginationAndSorting.current.sortBy));
    requestUrl.searchParams.set('q', paginationAndSorting.current.queryCacheKey);
  }

  if (searchCriteria.current?.field) {
    const { field, value, gtmfield } = searchCriteria.current;
    requestUrl.searchParams.set('key', field);
    requestUrl.searchParams.set('value', value);
    requestUrl.searchParams.set('gtmfield', gtmfield);
  }

  if (filtersRefs.current.types?.length > 0) {
    filtersRefs.current.types.forEach((type) => {
      requestUrl.searchParams.append('type', type);
    });
  }

  if (filtersRefs.current.statuses?.length > 0) {
    filtersRefs.current.statuses.forEach((status) => {
      requestUrl.searchParams.append('status', status);
    });
  }

  setSearchCriteriaDefaultDateRange({
    searchCriteria,
    requestUrl,
    filtersRefs
  });

  try {
    console.log('Utils::fetchData:url=' + requestUrl.href);
    const result = await usGet(requestUrl.href);
    return result;
  } catch (error) {
    console.error('Utils::fetchData::error on orders tracking grid >>', error);
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

export async function fetchGetUserAEM() {
  try {
    const result = await usGet(`/ui-account/v1/GetUser/AEM`);
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking details grid >>', error);
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