import { getDictionaryValueOrKey } from "../../../../../utils/utils";

const pushDataLayer = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

const getSortAnalytics = (category, sortedModel) => {
  const sortData = sortedModel.map((item) => `${item.colId}:${item.sort}`);
  return {
    event: 'Order tracking - Sort',
    type: 'button',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      title: '',
      id: '',
      sortInfo: {
        sortBy: [...sortData],
      },
    },
  };
};

const getPaginationAnalytics = (category, pageEvent, pageNumber) => {
  return {
    event: 'Order tracking - Pagination',
    type:
      pageEvent === ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo
        ? 'input'
        : 'button',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      title: pageEvent,
      id: '',
      paginationInfo: {
        Details: 'false',
        PageSize: '25',
        PageNumber: pageNumber,
        withPaginationInfo: 'true',
      },
    },
  };
};

const getFilterAnalytics = (category, filterData) => {
  const filters = filterData?.length > 0 ? filterData : [];
  return {
    event: 'Order tracking - Advanced Search',
    type: 'button',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      id: '',
      filterInfo: {
        filterBy: [...filters],
      },
    },
  };
};

const getReportAnalytics = (category, option) => {
  return {
    event: 'Order tracking - Reports',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      id: '',
      orderTracking: getDictionaryValueOrKey(option),
    },
  };
};

const getExportAnalytics = (category, option) => {
  return {
    event: 'Order tracking - Export',
    type: 'button',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      id: '',
      orderTracking: getDictionaryValueOrKey(option),
    },
  };
};

const getRowAnalytics = (category, action, itemData) => {
  const analyticsCategory = category.replace(/ /g, '');
  const infoKey = `${analyticsCategory}Info`;
  const retObject = {
    event: 'Order tracking - Rows',
    type: 'button',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      title: itemData?.source?.id,
      id: itemData?.source?.id,
      action: `${getDictionaryValueOrKey(action)} ${getDictionaryValueOrKey(category)}`,
      linkInfo: {
        url: itemData?.link ? itemData?.link : '',
      },
    },
  };
  retObject.clickInfo[infoKey] = {
    vendor: itemData?.vendor?.name,
    reseller: itemData?.reseller?.name,
  };
  return retObject;
};

const getSearchAnalytics = (category, dropdownOption, textInput) => {
  let retObject = {
    event: 'Order tracking - Search',
    type: 'button',
    clickInfo: {
      category: getDictionaryValueOrKey(category),
      id: '',
      orderTracking: getDictionaryValueOrKey(dropdownOption),
      userInput: textInput,
    },
  };
  return retObject;
};

const ANALYTIC_CONSTANTS = {
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

export {
  getFilterAnalytics,
  getPaginationAnalytics,
  getRowAnalytics,
  getSearchAnalytics,
  getSortAnalytics,
  getReportAnalytics,
  getExportAnalytics,
  pushDataLayer,
  ANALYTIC_CONSTANTS,
};
