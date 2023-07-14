import { getDictionaryValueOrKey } from "../../../../../utils/utils";

export const pushDataLayerGoogle = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

export const getSortAnalyticsGoogle = (category, sortedModel) => {
  const sortData = sortedModel.map((item) => `${item.colId}:${item.sort}`);
  return {
    event: 'Order tracking - Grid Sort',
    category: getDictionaryValueOrKey(category),
    sortBy: [...sortData],
  };
};

export const getPaginationAnalyticsGoogle = (
  category,
  pageEvent,
  pageNumber
) => {
  return {
    event: 'Order tracking - Pagination',
    category: getDictionaryValueOrKey(category),
    title: pageEvent,
    Details: 'false',
    PageSize: '25',
    PageNumber: pageNumber,
    withPaginationInfo: 'true',
  };
};

export const getFilterAnalyticsGoogle = (category, filterData) => {
  const filters = filterData?.length > 0 ? filterData : [];
  return {
    event: 'Order tracking - Advanced Search',
    category: getDictionaryValueOrKey(category),
    filterBy: [...filters],
  };
};

export const getReportAnalyticsGoogle = (category, option) => {
  return {
    event: 'Order tracking - Reports',
    category: getDictionaryValueOrKey(category),
    orderTracking: getDictionaryValueOrKey(option),
  };
};

export const getExportAnalyticsGoogle = (category, option) => {
  return {
    event: 'Order tracking - Export',
    category: getDictionaryValueOrKey(category),
    orderTracking: getDictionaryValueOrKey(option),
  };
};

export const getSearchAnalyticsGoogle = (
  category,
  dropdownOption,
  textInput
) => {
  return {
    event: 'Order tracking - Search',
    category: getDictionaryValueOrKey(category),
    orderTracking: getDictionaryValueOrKey(dropdownOption),
    userInput: textInput,
  };
};

export const ANALYTIC_CONSTANTS = {
  Grid: {
    Category: ['Order Tracking'],
    PaginationEvent: {
      PageBegin: 'Page begin',
      PageBack: 'Page backward',
      PageForward: 'Page forward',
      PageEnd: 'Page end',
      PageNo: 'Page input',
    },
    RowActions: {
      Copy: 'Copy',
      DownloadPdf: 'Download PDF',
      DownloadXls: 'Download XLS',
      DownloadPdfExpanded: 'Download PDF from Expanded',
      DownloadXlsExpanded: 'Download XLS from Expanded',
      Order: 'Place Order',
      OrderExpanded: 'Place Order from Expanded',
      DNote: 'View DNote',
      Invoice: 'View Invoice',
      ViewDetail: 'View Detail',
      ViewDetailExpanded: 'View Detail from Expanded',
    },
  },
  Detail: {
    Actions: {
      CopyDetail: 'Copy from Detail',
      DownloadPdfDetail: 'Download PDF from Detail',
      DownloadXlsDetail: 'Download XLS from Detail',
      OrderDetail: 'Place Order from Detail',
    },
  },
};
