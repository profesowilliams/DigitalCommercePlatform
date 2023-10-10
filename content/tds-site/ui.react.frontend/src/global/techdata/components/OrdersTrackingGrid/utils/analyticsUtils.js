import { getDictionaryValueOrKey } from "../../../../../utils/utils";

export const pushDataLayerGoogle = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

export const getSortAnalyticsGoogle = (category, sortedModel) => {
  const sortData = sortedModel
    .map((item) => `${item.colId}: ${item.sort}`)
    .join();
  return {
    event: 'Order tracking - Grid Sort',
    category: getDictionaryValueOrKey(category),
    orderTracking: sortData,
  };
};

export const getPaginationAnalyticsGoogle = (category, pageEvent) => {
  return {
    event: 'Order tracking - Pagination',
    category: getDictionaryValueOrKey(category),
    orderTracking: pageEvent,
  };
};

export const getFilterAnalyticsGoogle = (category, filterData, dateLabel) => {
  const filters = filterData?.length > 0 ? filterData : [];
  return {
    event: 'Order tracking - Advanced Search',
    category: getDictionaryValueOrKey(category),
    orderTracking: filters.join('|'),
    label: dateLabel,
  };
};

export const getReportAnalyticsGoogle = (category, option) => {
  return {
    event: 'Order tracking - Reports',
    category: getDictionaryValueOrKey(category),
    orderTracking: getDictionaryValueOrKey(option?.label),
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
    orderTracking: `${getDictionaryValueOrKey(dropdownOption)}: ${textInput}`,
  };
};

export const getHomeAnalyticsGoogle = (rights) => {
  return {
    event: 'Order tracking - Home',
    orderTracking: `Home: ${getDictionaryValueOrKey(rights)}`,
    action: 'Rights',
  };
};

export const getOrderDetailsAnalyticsGoogle = (number) => {
  return {
    event: 'Order tracking - Order Details',
    orderTracking: `Order Details: ${number}`,
  };
};

export const getDNoteViewAnalyticsGoogle = (numberOfDownloads, dNoteLabel) => {
  return {
    event: 'Order tracking - D-Note View',
    orderTracking: `D-Note View: ${numberOfDownloads}`,
    label: getDictionaryValueOrKey(dNoteLabel),
  };
};

export const getMainGridAnalyticsGoogle = (number, invoiceLabel) => {
  return {
    event: 'Order tracking - Main Grid',
    orderTracking: `Invoice View: ${number}`,
    label: getDictionaryValueOrKey(invoiceLabel),
  };
};

export const getInvoiceViewAnalyticsGoogle = (number, invoiceLabel) => {
  return {
    event: 'Order tracking - Invoice View',
    orderTracking: `Invoice View: ${number}`,
    label: getDictionaryValueOrKey(invoiceLabel),
  };
};

export const getErrorPageAnalyticsGoogle = (errorNumber) => {
  return {
    event: 'Order tracking - Error Page',
    orderTracking: `Error Page: ${errorNumber}`,
  };
};

export const getMainDashboardAnalyticsGoogle = () => {
  return {
    event: 'Order tracking - Main Dashboard',
    orderTracking: 'Main Dashboard',
  };
};

export const getPageReloadAnalyticsGoogle = ({
  country,
  internalTraffic,
  pageName,
  number,
  userID,
  customerID,
  industryKey,
}) => {
  return {
    event: 'pageReload',
    country,
    internalTraffic,
    pageCategory: 'Order Tracking',
    pageName: `${pageName} ${number}`,
    userID,
    customerID,
    industryKey,
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
      DownloadPdf: 'Download PDF',
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
