const columnDefs = [
  {
    headerName: '',
    field: 'dropdownArrow',
    width: '100px',
    sortable: false,
    cellStyle: {
      'white-space': 'normal',
      padding: '12px 0',
      paddingLeft: '20px',
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
    headerName: 'QTY',
    field: 'quantity',
    sortable: false,
    cellStyle: {
      padding: '12px 0',
      'text-align': 'right',
      paddingRight: '26px',
    },
    headerClass: 'right-aligned-shipped-qty',
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
