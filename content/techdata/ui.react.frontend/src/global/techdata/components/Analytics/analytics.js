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

const ANALYTIC_CONSTANTS = {
  "Grid": {
    "Category": [
      "Renewals",
      "Order Tracking"
    ],
    "PaginationEvent": {
      "PageBegin": "Page begin",
      "PageBack": "Page backward",
      "PageForward": "Page forward",
      "PageEnd": "Page end",
      "PageNo": "Page input"
    }
  }
};

export { pushDataLayer, getSortAnalytics, getPaginationAnalytics, ANALYTIC_CONSTANTS };
