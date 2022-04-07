const columnDefs = [
  {
    headerName: "Line",
    field: "id",
    width: "50px",
    sortable: false,
    cellStyle: {'white-space': 'normal'},
    autoHeight: true
  },
  {
    headerName: "Product family",
    field: "vendorPartNo",
    width: "200px",
    sortable: false,
    cellStyle: {'white-space': 'normal'},
    autoHeight: true
  },
  {
    headerName: "Product details",
    field: "shortDescription",
    sortable: false,
    width: "300px",
    cellStyle: {'white-space': 'normal'},
    autoHeight: true
  },
  {
    headerName: "Mfr. part №",
    field: "mfrNumber",
    sortable: false,
    width: "200px",
    cellStyle: {'white-space': 'normal'},
    autoHeight: true
  },
  {
    headerName: "Unit price (USD)",
    field: "unitPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-start'},
    autoHeight: true
  },
  {
    headerName: "Quantity",
    field: "quantity",
    sortable: false,
    width: "100px",
    cellStyle: { 'justify-content': 'flex-start'},
    autoHeight: true
  },
  {
    headerName: "Total (USD)",
    field: "totalPrice",
    sortable: false,
    width: "150px",
    cellStyle: { 'justify-content': 'flex-start'},
    autoHeight: true
  },
];

export default columnDefs;
