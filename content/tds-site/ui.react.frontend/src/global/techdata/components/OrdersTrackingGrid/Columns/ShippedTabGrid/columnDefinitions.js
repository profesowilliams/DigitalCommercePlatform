const columnDefs = [
  {
    headerName: '',
    field: 'dropdownArrow',
    width: '100px',
    sortable: false,
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
    },
    autoHeight: true,
  },
  {
    headerName: 'SHIP DATE',
    field: 'actualShipDateFormatted',
    sortable: true,
    width: '500px',
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
    },
    autoHeight: true,
  },
  {
    headerName: 'D-NOTE',
    field: 'deliveryNotes',
    sortable: false,
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
    },
    autoHeight: true,
  },
  {
    headerName: 'INVOICE',
    field: 'invoices',
    sortable: false,
    cellStyle: { padding: '12px 0' },
    autoHeight: true,
  },
  {
    headerName: 'VALUE',
    field: 'totalPrice',
    sortable: false,
    cellStyle: { padding: '12px 0' },
    autoHeight: true,
  },
  {
    headerName: 'QTY',
    field: 'quantity',
    sortable: false,
    cellStyle: { padding: '12px 0' },
    autoHeight: true,
  },
  {
    headerName: '',
    field: 'track',
    sortable: false,
    cellStyle: { padding: '12px 0' },
    autoHeight: true,
  },
];

export default columnDefs;
