const columnDefs = [
  {
    headerName: 'LINE',
    field: 'lineNumber',
    width: '100px',
    sortable: false,
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 20px',
    },
    autoHeight: true,
  },
  {
    headerName: 'ITEM',
    field: 'item',
    sortable: true,
    width: '500px',
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 20px',
    },
    autoHeight: true,
  },
  {
    headerName: 'PN/SKU',
    field: 'pnsku',
    sortable: false,
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 20px',
    },
    autoHeight: true,
  },
  {
    headerName: 'QTY',
    field: 'nqty',
    sortable: false,
    cellStyle: { padding: '12px 20px' },
    autoHeight: true,
  },
  {
    headerName: 'DELIVERY ESTIMATE',
    field: 'deliveryEstimate',
    sortable: false,
    cellStyle: { padding: '12px 20px' },
    autoHeight: true,
  },
  {
    headerName: '',
    field: 'action',
    sortable: false,
    cellStyle: { padding: '12px 20px' },
    autoHeight: true,
  },
];
export default columnDefs;
