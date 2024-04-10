
export const pushDataLayerGoogle = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

export const getSortAnalyticsGoogle = (sortedModel, searchTrigger) => {
  const sortData = sortedModel
    .map((item) => `${item.colId}: ${item.sort}`)
    .join();
  return {
    event: 'Order tracking - Grid Sort',
    category: 'Sort',
    orderTracking: sortData,
    searchTrigger,
  };
};

export const getPaginationAnalyticsGoogle = (pageEvent, pageNum) => {
  return {
    event: 'Order tracking - Pagination',
    category: 'Pagination',
    orderTracking: pageEvent,
    pageNumber: pageNum,
  };
};

export const getFilterAnalyticsGoogle = (category, filterData, dateLabel) => {
  const filters = filterData?.length > 0 ? filterData : [];
  return {
    event: 'Order tracking - Advanced Search',
    category,
    orderTracking: filters.join('|'),
    label: dateLabel,
  };
};

const getEnglishReportLabel = (optionKey) => {
  switch (optionKey) {
    case 'OpenOrders':
      return 'Open Orders';
    case 'NewBacklog':
      return 'New Backlog';
    case 'EOLOrders':
      return 'End of Life Orders';
    case 'TodaysShipmentsDeliveries':
      return `Today's Shipments/Deliveries`;
    case 'Last7DaysOrders':
      return 'Last 7 Days Orders';
    case 'Last30DaysOrders':
      return 'Last 30 Days Orders';
    case 'Last7DaysShipments':
      return 'Last 7 Days Shipments';
    case 'Last30DaysShipments':
      return 'Last 30 Days Shipments';
    default:
      return optionKey;
  }
}

export const getEnglishFiltersLabel = (optionKey) => {
  const labels = {
    OPEN: 'Open',
    INVESTIGATION: 'Investigation',
    SHIPPING: 'Shipping',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
    ON_HOLD: 'On Hold',
    SHIPPED: 'Shipped',
    IN_PROCESS: 'In Process',
    INTOUCH: 'In Touch',
    EDI_OR_XML: 'EDI or XML',
    LICENSING: 'Licensing',
    MANUAL: 'Manual',
    STOCKING_ORDER: 'Stocking Order',
    THIRD_PARTY: 'Third Party',
    STREAM_ONE: 'Stream One',
  };
  return labels[optionKey] || optionKey;
};

export const getEngUserDataAnalyticsGoogle = () => {
  return {
    event: "Order tracking - End User Data",
    action: "popup"
  }
}

export const getReportAnalyticsGoogle = (category, option) => {
  const reportEnglishLabel = getEnglishReportLabel(option.key);
  return {
    event: 'Order tracking - Reports',
    category,
    orderTracking: reportEnglishLabel,
  };
};

export const getExportAnalyticsGoogle = (category, option) => {
  return {
    event: 'Order tracking - Export',
    category,
    orderTracking: option,
  };
};

export const getSearchAnalyticsGoogle = (
  category,
  dropdownOption,
  textInput
) => {
  return {
    event: 'Order tracking - Search',
    category,
    orderTracking: `${dropdownOption}: ${textInput}`,
  };
};

export const getHomeAnalyticsGoogle = (rights) => {
  return {
    event: 'Order tracking - Home',
    orderTracking: `Home: ${rights}`,
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
    label: dNoteLabel,
  };
};

export const getMainGridAnalyticsGoogle = (number, invoiceLabel) => {
  return {
    event: 'Order tracking - Main Grid',
    orderTracking: `Invoice View: ${number}`,
    label: invoiceLabel,
  };
};

export const getInvoiceViewAnalyticsGoogle = (number, invoiceLabel) => {
  return {
    event: 'Order tracking - Invoice View',
    orderTracking: `Invoice View: ${number}`,
    label: invoiceLabel,
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

export const getProActiveSettingsActivactionAnalyticsGoogle = (active) => {
  return {
    event: 'Order tracking - Pro Active Messaging- Settings',
    orderTracking: `Pro Active Messaging - Type Active`,
    label: active,
  };
};

export const getProActiveNotificationAnalyticsGoogle = (value) => {
  return {
    event: 'Order tracking - Pro Active Messaging- Settings',
    orderTracking: 'Pro Active Messaging - Type Notification Messages',
    label: value === 'Intouch' ? 'InTouch' : 'All',
  };
};

export const getProActiveTypesAnalyticsGoogle = ( value ) => {
  return {
    event: 'Order tracking - Pro Active Messaging- Settings',
    orderTracking: 'Pro Active Messaging - Type types',
    label: value,
  };
};

export const getSelectItemAnalyticsGoogle = (item_name, item_id, price, index) => {
  return {
    event: "select_item",
    ecommerce: {
      item_list_name: "OrderTrackingDetails",
      items: [
        {
          item_name,
          item_id,
          price,
          index
        }
      ]
    }
  }
}

export const getProActiveMailAnalyticsGoogle = (value, isAdditional) => {
  const additional = isAdditional ? " Additional" : "";
  return {
    event: 'Order tracking - Pro Active Messaging- Settings',
    orderTracking: `Pro Active Messaging - Type${additional} Email`,
    label: value,
  };
};

export const getReturnAnalyticsGoogle = (counter) => {
  return {
    event: 'Order tracking - Return link',
    orderTracking: `Return link ${counter}`,
    label: 'Order Details',
  };
};

export const getTrackAndTraceAnalyticsGoogle = (counter, isMainGrid, host) => {
  const hostname = host ? `www.${host.toLowerCase()}.com` : "";
  return {
    event: 'Order tracking - Track & Trace',
    orderTracking: `Track & Trace: "Carrier Link ${hostname}" ${counter}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
}

export const getAddLineAnalyticsGoogle = (sku) => {
  return {
    event: 'Order tracking - Order Modification',
    orderTracking: 'Order Modification - addLine',
    label: sku,
  };
};

export const getReduceQuantityAnalyticsGoogle = (sku) => {
  return {
    event: 'Order tracking - Order Modification',
    orderTracking: 'Order Modification - reduceQuantity',
    label: sku,
  };
};

export const getEolCancelAnalyticsGoogle = (sku) => {
  return {
    event: 'Order tracking - Order Modification',
    orderTracking: 'Order Modification - eolCancel',
    label: sku,
  };
};

export const getEolReplacementAnalyticsGoogle = (sku, addedSku) => {
  return {
    event: 'Order tracking - Order Modification',
    orderTracking: 'Order Modification - eolReplacement',
    label: `${sku} replaced by ${addedSku}`,
  };
};

export const getDNoteDownloadFailedAnalyticsGoogle = (counter, isMainGrid) => {
  return {
    event: 'Order tracking - D-Note View download failed',
    orderTracking: `D-Note View download failed: ${counter}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
};

export const getInvoiceDownloadFailedAnalyticsGoogle = (
  counter,
  isMainGrid
) => {
  return {
    event: 'Order tracking - Invoice View download failed',
    orderTracking: `Invoice View download failed: ${counter}`,
    label: isMainGrid ? 'Main Grid' : 'Order Details',
  };
};

export const getExpandedLineAnalyticsGoogle = (orderId) => {
  return {
    event: 'Order tracking - Expanded Line View',
    orderTracking: `Expanded Line VIew`,
    label: orderId,
  };
};

export const getExportSerialNumbersAnalyticsGoogle = () => {
  return {
    event: 'Export Serial Numbers - Header',
    orderTracking: 'Serial Numbers',
    label: 'Header Action Menu',
  };
};

export const getCopySerialNumbersAnalyticsGoogle = () => {
  return {
    event: 'Copy Serial Numbers - Line',
    orderTracking: 'Serial Numbers',
    label: 'Line Level Action Menu',
  };
};

export const getSearchNRFAnalyticsGoogle = () => {
  return {
    event: 'Search|NRF',
    orderTracking: 'NRF',
    label: 'No results found',
  };
};

export const getAdvancedSearchNRFAnalyticsGoogle = () => {
  return {
    event: 'Advanced Search|NRF',
    orderTracking: 'NRF',
    label: 'No results found',
  };
};

export const getReportsNRFAnalyticsGoogle = (reportName) => {
  return {
    event: 'Reports|NRF',
    orderTracking: `NRF <${reportName}>`,
    label: 'No results found',
  };
};

export const pushFailedDownloadGoogleAnalytics = (
  flyoutType,
  isMainGrid,
  dNoteDownloadFailedCounter,
  invoiceDownloadFailedCounter,
) => {
  if (flyoutType === 'DNote') {
    pushDataLayerGoogle(
      getDNoteDownloadFailedAnalyticsGoogle(
        dNoteDownloadFailedCounter,
        isMainGrid
      )
    );
  } else if (flyoutType === 'Invoice') {
    pushDataLayerGoogle(
      getInvoiceDownloadFailedAnalyticsGoogle(
        invoiceDownloadFailedCounter,
        isMainGrid
      )
    );
  }
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
