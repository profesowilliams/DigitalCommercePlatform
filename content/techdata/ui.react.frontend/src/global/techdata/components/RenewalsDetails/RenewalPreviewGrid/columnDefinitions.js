const columnDefs = [
  {
    headerName: "Line",
    field: "id",
    width: "100px",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'top-aligned',
  },
  {
    headerName: "Product family",
    field: "vendorPartNo",
    width: "200px",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'top-aligned',
  },
  {
    headerName: "Product details",
    field: "shortDescription",
    sortable: false,
    width: "500px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'top-aligned',
  },
  {
    headerName: "Vendor part №",
    field: "mfrNumber",
    sortable: false,
    width: "200px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'top-aligned',
  },
  {
    headerName: "List price",
    field: "unitListPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned top-aligned'
  },
  {
    headerName: "% off list price",
    field: "value",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned top-aligned'
  },
  {
    headerName: "Unit price",
    field: "unitPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned top-aligned'
  },
  {
    headerName: "Quantity",
    field: "quantity",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned top-aligned'
  },
  {
    headerName: "Total",
    field: "totalPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-end', 'padding': '10px'},
    autoHeight: true,
    headerClass: 'right-aligned top-aligned'
  },
];

export default columnDefs;
