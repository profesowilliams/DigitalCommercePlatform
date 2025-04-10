import { SORT_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { getLocalStorageData } from "../RenewalsGrid/utils/renewalUtils";

// House all of the functions for handling analytics such as pushes to GDL. Export for use in components
const pushDataLayer = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

const getSortAnalytics = (category, sortedModel) => {
  const sortData = sortedModel.map((item) => `${item.colId}:${item.sort}`);
  return {
    "event": "click",
    "type": "button",
    "clickInfo": {
      "category": category,
      "title": "",
      "id": "",
      "action": "sort",
      "sortInfo": {
        "sortBy": [...sortData
        ]
      }
    }
  };
};

const getPaginationAnalytics = (category, pageEvent, pageNumber) => {
  const sortData = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
  return {
    "event": "click",
    "type": pageEvent === ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo ? "input" : "button",
    "clickInfo": {
      "category": category,
      "title": pageEvent,
      "id": "",
      "action": "pagination",
      "paginationInfo": {
        "Details": "false",
        "PageSize": "25",
        "PageNumber": pageNumber,
        "withPaginationInfo": "true",
        "sortBy": [
          ...sortData?.sortData
        ]
      }
    }
  };
};

const getFilterAnalytics = (category, filterData) => {
  const filters = filterData?.length ? Object.entries(filterData[0]) : [];
  const sortData = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
  return {
    "event": "click",
    "type": "button",
    "clickInfo": {
      "category": category,
      "title": "Filters",
      "id": "",
      "action": "Filter results",
      "filterInfo": {
        "filterBy": [...filters
        ],
        "sortBy": [
          ...sortData?.sortData
        ]
      }
    }
  };
};

const getRequestQuoteAnalytics = (quoteType, component, quoteNum, vendorName) => {
  const pageType = component === 'dashboard' ? `Dashboard|${quoteNum}` : `Renewal Details|${quoteNum}`;
  const retObject = {
    "event": "Request Quote",
    "origin": pageType,
    "quote_type": 2, // (1, 2, or 3 depending on the case)
    "action": "request quote - flyout open",
    "vendor": vendorName // (e.g., "Adobe")
  };
  return retObject;
};

const getRequestQuoteClickedAnalytics = (quoteType, component, quoteNum, vendorName, result) => {
    const pageType = component === 'dashboard' ? `Dashboard|${quoteNum}` : `Renewal Details|${quoteNum}`;
    return {
        "event": "Request Quote",
        "origin": pageType,
        "quote_type": 2,
        "action": "request quote - confirmation",
        "label": result, // (either "success" or "failure")
        "vendor": vendorName
    }
}

const getRowAnalytics = (category, action, itemData) => {
  const analyticsCategory = category.replace(/ /g, '');
  const infoKey = `${analyticsCategory}Info`;
  const retObject = {
    "event": "click",
    "type": "button",
    "clickInfo": {
      "category": category,
      "title": itemData?.source?.id,
      "id": itemData?.source?.id,
      "action": `${action} ${category}`,
      "linkInfo": {
        "url": itemData?.link ? itemData?.link : ''
      }
    }
  };
  retObject.clickInfo[infoKey] = {
    "vendor": itemData?.vendor?.name,
    "reseller": itemData?.reseller?.name
  };
  return retObject;
};

const getSearchAnalytics = (category, searchData) => {
  const sortData = getLocalStorageData(SORT_LOCAL_STORAGE_KEY);
  const searchKey = searchData?.field?.replace(/ /g, '');
  let retObject = {
    "event": "click",
    "type": "button",
    "clickInfo": {
      "category": category,
      "title": "Search",
      "id": "",
      "action": "Search",
      "searchInfo": {
        "sortBy": [
          ...sortData?.sortData
        ]
      }
    }
  };
  if (searchData && searchData.field && searchKey) {
    retObject.clickInfo.searchInfo[searchKey] = searchData.value;
  }

  return retObject;
};

const ANALYTIC_CONSTANTS = {
  "Grid": {
    "Category": [
      "Renewals",
      "Order Tracking",
    ],
    "PaginationEvent": {
      "PageBegin": "Page begin",
      "PageBack": "Page backward",
      "PageForward": "Page forward",
      "PageEnd": "Page end",
      "PageNo": "Page input",
    },
    "RowActions": {
      "Copy": "Copy",
      "DownloadPdf": "Download PDF",
      "DownloadXls": "Download XLS",
      "DownloadPdfExpanded": "Download PDF from Expanded",
      "DownloadXlsExpanded": "Download XLS from Expanded",
      "Order": "Place Order",
      "OrderExpanded": "Place Order from Expanded",
      "DNote": "View DNote",
      "Invoice": "View Invoice",
      "ViewDetail": "View Detail",
      "ViewDetailExpanded": "View Detail from Expanded",
    }
  },
  "Detail": {
    "Actions": {
      "CopyDetail": "Copy from Detail",
      "DownloadPdfDetail": "Download PDF from Detail",
      "DownloadXlsDetail": "Download XLS from Detail",
      "OrderDetail": "Place Order from Detail"
    },
  }
};

export {
  getFilterAnalytics,
  getPaginationAnalytics,
  getRowAnalytics,
  getRequestQuoteAnalytics,
  getRequestQuoteClickedAnalytics,
  getSearchAnalytics,
  getSortAnalytics,
  pushDataLayer,
  ANALYTIC_CONSTANTS
};
