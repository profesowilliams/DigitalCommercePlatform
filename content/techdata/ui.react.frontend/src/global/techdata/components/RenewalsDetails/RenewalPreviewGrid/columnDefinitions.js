const columnDefs = [
  {
    headerName: "Line",
    field: "id",
    width: "100px",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
  },
  {
    headerName: "Product family",
    field: "vendorPartNo",
    width: "200px",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
  },
  {
    headerName: "Product details",
    field: "shortDescription",
    sortable: false,
    width: "500px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
  },
  {
    headerName: "Vendor part №",
    field: "mfrNumber",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
  },
  {
    headerName: "List price",
    field: "unitListPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned'
  },
  {
    headerName: "% off list price",
    field: "value",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned'
  },
  {
    headerName: "Unit price",
    field: "unitPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned'
  },
  {
    headerName: "Quantity",
    field: "quantity",
    sortable: false,
    cellStyle: { 'justify-content': 'center', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'center-aligned'
  },
  {
    headerName: "Total",
    field: "totalPrice",    
    width: "150px",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned'
  },
];

export default columnDefs;
