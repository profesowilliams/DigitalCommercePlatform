import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OrderTrackingGrid from './OrdersTrackingGrid';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockedProps = {
  detailUrl: '/content/tds-site/europe/uk/en/dcp/order-tracking/order-details',
  columnList: [
    {
      columnLabel: 'Updated',
      columnKey: 'updated',
      sortable: true,
      type: 'plainText',
    },
    {
      columnLabel: 'Ship to',
      columnKey: 'shipTo',
      sortable: true,
      type: 'plainText',
    },
    {
      columnLabel: 'Status',
      columnKey: 'status',
      sortable: true,
      type: 'plainText',
    },
    {
      columnLabel: 'Order Date',
      columnKey: 'created',
      sortable: true,
      type: 'plainText',
    },
    {
      columnLabel: 'Order Nº',
      columnKey: 'id',
      sortable: false,
      type: 'plainText',
    },
    {
      columnLabel: 'PO Nº',
      columnKey: 'reseller',
      sortable: true,
      type: 'plainText',
    },
    {
      columnLabel: 'Total',
      columnKey: 'priceFormatted',
      sortable: true,
      type: 'plainText',
    },
    {
      columnLabel: 'Invoices',
      columnKey: 'invoices',
      sortable: false,
      type: 'plainText',
    },
    {
      columnLabel: 'D-notes',
      columnKey: 'deliveryNotes',
      sortable: false,
      type: 'plainText',
    },
  ],
  multiple: 'Multiple',
  exportOptionsList: [{ label: 'Excel (.xlxs)', key: 'exportOptionsListKey' }],
  exportSecondaryOptionsList: [
    { label: 'Export all order lines', key: 'exportAllOrderLinesKey' },
    {
      label: 'Export lines with serial numbers only',
      key: 'exportLinesWithSerialNumbersKey',
    },
  ],
  exportFlyout: {
    title: 'Export',
    description: 'Send to',
    secondaryDescription: 'Details to include',
    button: 'Export',
  },
  invoicesColumnList: [
    { columnLabel: 'Invoice №', columnKey: 'id' },
    { columnLabel: 'Ship Date', columnKey: 'created' },
  ],
  invoicesFlyout: {
    title: 'Invoices',
    description: ' Click a link to view or select items to download.  ',
    orderNo: 'Order №:',
    poNo: 'PO №:',
    button: 'Download selected ',
    clearAllButton: 'Clear all',
  },
  dNoteColumnList: [
    { columnLabel: 'D-note №', columnKey: 'id' },
    { columnLabel: 'Ship Date', columnKey: 'actualShipDate' },
  ],
  dNotesFlyout: {
    title: 'D-notes',
    description: 'Click a link to view or select items to download.',
    orderNo: 'Order №: ',
    poNo: 'PO №:',
    button: 'Download selected',
    clearAllButton: 'Clear all',
  },
  reportPillLabel: 'Report',
  noAccessProps: {
    noAccessTitle: 'Access permisions needed',
    noAccessMessage:
      "Looks like your credentials don't include this area. If you feel this is a mistake, please contact your administrator to request a change.",
    noAccessBack: 'Go back',
  },
  searchOptionsList: [
    {
      searchLabel: 'Order Nº',
      searchKey: 'Id',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: 'PO Number',
      searchKey: 'Id',
      showIfIsHouseAccount: false,
    },
    {
      searchLabel: 'Invoice Number',
      searchKey: 'Id',
      showIfIsHouseAccount: false,
    },
  ],
  uiServiceEndPoint:
    'https://westeu-dit-ui.dc.tdebusiness.cloud/ui-commerce/v2/orders',
  ordersCountEndpoint:
    'https://westeu-dit-ui.dc.tdebusiness.cloud/ui-commerce/v2/orderscount',
  ordersReportEndpoint:
    'https://westeu-dit-ui.dc.tdebusiness.cloud/ui-commerce/v2/ReportOrders',
  ordersReportCountEndpoint:
    'https://westeu-dit-ui.dc.tdebusiness.cloud/ui-commerce/v2/ReportOrdersCount',
  ordersDownloadDocumentsEndpoint:
    'https://westeu-dit-ui.dc.tdebusiness.cloud/ui-commerce/v2/DownloadDocuments',
  agGridLicenseKey:
    'CompanyName=Tech Data Corporation,LicensedGroup=1602297,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=25,LicensedProductionInstancesCount=2,AssetReference=AG-036821,SupportServicesEnd=16_March_2024_[v2]_MTcxMDU0NzIwMDAwMA==bc4bd0ff633ce8a7dc0be1551198da2b',
  itemsPerPage: '25',
  shopURL: 'https://shop.cstenet.com/orders',
  paginationStyle: 'scroll',
  options: {
    defaultSortingColumnKey: 'created',
    defaultSortingDirection: 'desc',
  },
  menuCopy: 'Copy',
  menuCopyWithHeaders: 'Copy with headers',
  menuExport: 'Export',
  menuCsvExport: 'CSV Export',
  menuExcelExport: 'Excel Eport',
  menuOpenLink: 'Open link in new tab',
  menuCopyLink: 'Copy link',
  ofTextLabel: 'of',
  dateOptionValues: [{ label: 'Data Range1', field: 'custom' }],
  defaultSearchDateRange: '30',
  filterListValues: [
    {
      accordionLabel: 'Filter1',
      filterField: 'status',
      filterOptionsValues: [],
    },
  ],
  filterLabels: {
    dateRange: 'Date Range',
    endLabel: 'End',
    startLabel: 'Start',
    addDateLabel: 'Add Date',
    filterTitle: 'Filters',
    filterType: 'static',
    showResultLabel: 'Show Results',
    orderStatus: 'Order Status',
    orderType: 'Order Type',
    open: 'Open',
    investigation: 'Investigation',
    shipping: 'Shipping',
    reject: 'Reject',
    complete: 'Complete',
    cancelled: 'Cancelled',
    onHold: 'OnHold',
    shipped: 'Shipped',
    inProcess: 'InProcess',
    inTouch: 'InTouch',
    ediOrXml: 'Edi Or Xml',
    consignmentFillUp: 'Consignment Fill-Up',
    license: 'License',
    tdmrsProject: 'TDMRS Project',
    manual: 'Manual',
    tdStaffPurchase: 'TD Staff purchase',
    projectOrder: 'Project order',
    quotationLabel: 'Quotation',
    thirdParty: 'Third Party',
    licensing: 'Licensing',
    stockingOrder: 'Stocking Order',
    streamOne: 'StreamOne',
  },
  productGrid: {
    quoteIdLabel: 'Quote ID:',
    refNoLabel: 'Ref No:',
    expiryDateLabel: 'Expiry Date:',
    downloadPDFLabel: 'Download PDF',
    downloadXLSLabel: 'Download XLS',
    seeDetailsLabel: 'See details',
  },
  icons: {
    '0-30': { overdueIcon: 'fas fa-bell', overdueIconColor: '#CD163F' },
    overdue: {
      afterZeroIcon: 'fas fa-alarm-clock',
      afterZeroIconColor: '#F7B500',
    },
    '31-60': {
      afterThirtyIcon: 'fas fa-clock',
      afterThirtyIconColor: '#38853C',
    },
    '61+': { sixtyPlusIcon: 'calendar', sixtyPlusIconColor: '#006FBA' },
  },
  searchResultsError: {
    noResultsTitle: 'No results found ',
    noResultsDescription:
      'There are no results for your current search. Adjust search criteria to improve results. ',
    noResultsImage:
      '/content/dam/tds-site/tds-site-shared/error-icons/search-error-tds.png',
    noDataTitle: 'No results found example ',
    noDataDescription:
      'There are no results for your current search. Adjust search criteria to improve results. example  ',
    noDataImage:
      '/content/dam/tds-site/tds-site-shared/error-icons/search-error-tds.png',
  },
  analyticsCategories: {},
  paginationLabels: {},
};

window.document.getSelection = jest.fn();

test('grid loads', async () => {
  // ARRANGE
  const mockStore = configureStore();
  let store;
  store = mockStore({});

  Object.defineProperty(window, 'origin', { value: 'http://localhost:8080' });

  render(
    <Provider store={store}>
      <OrderTrackingGrid componentProp={JSON.stringify(mockedProps)} />
    </Provider>
  );

  // ACT
  await userEvent.click(screen.getByTestId('report'));
  await screen.findByTestId('report-dropdown');

  // ASSERT
  expect(await screen.findByTestId('report-option-0')).toBeVisible();
  expect(await screen.findByTestId('report-dropdown')).toBeInTheDocument();

  // CLEANUP
  // global.Granite = originalGranite;
});
