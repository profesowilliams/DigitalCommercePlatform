const columnDefs = [
  {
    headerName: 'LINE',
    field: 'lineNumber',
    width: '60px',
    sortable: false,
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
      paddingLeft: '20px',
    },
    autoHeight: true,
  },
  {
    headerName: 'ITEM',
    field: 'item',
    sortable: false,
    width: '425px',
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
    },
    autoHeight: true,
  },
  {
    headerName: 'PN/SKU',
    field: 'pnsku',
    sortable: false,
    width: '180px',
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
    },
    autoHeight: true,
  },
  {
    headerName: 'QTY',
    field: 'nqty',
    sortable: false,
    width: '70px',
    cellStyle: { padding: '0 0' },
    autoHeight: true,
  },
  {
    headerName: 'DELIVERY ESTIMATE',
    field: 'deliveryEstimate',
    sortable: false,
    width: '164px',
    cellStyle: {
      padding: '0 0',
    },
    autoHeight: true,
  },
  {
    headerName: '',
    field: 'action',
    sortable: false,
    width: '60px',
    cellStyle: { padding: '0 0' },
    autoHeight: true,
  },
];
export default columnDefs;
