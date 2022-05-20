const columnDefs = [
  {
    headerName: "Line",
    field: "id",
    width: "50px",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true
  },
  {
    headerName: "Product family",
    field: "vendorPartNo",
    width: "200px",
    sortable: false,
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true
  },
  {
    headerName: "Product details",
    field: "shortDescription",
    sortable: false,
    width: "500px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true
  },
  {
    headerName: "Mfr. part №",
    field: "mfrNumber",
    sortable: false,
    width: "200px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true
  },
  {
    headerName: "List Price (USD)",
    field: "unitListPrice",
    sortable: false,
    width: "100px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true
  },
  {
    headerName: "% off list price",
    field: "value",
    sortable: false,
    width: "100px",
    cellStyle: {'white-space': 'normal', 'padding': '10px'},
    autoHeight: true
  },
  {
    headerName: "Unit price (USD)",
    field: "unitPrice",
    sortable: false,
    cellStyle: { 'justify-content': 'flex-start', 'padding': '10px'},
    headerComponentParams : {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        '</div>'
    },
    autoHeight: true
  },
  {
    headerName: "Quantity",
    field: "quantity",
    sortable: false,
    width: "100px",
    cellStyle: { 'justify-content': 'flex-start', 'padding': '10px'},
    headerComponentParams : {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        '</div>'
    },
    autoHeight: true
  },
  {
    headerName: "Total (USD)",
    field: "totalPrice",
    sortable: false,
    width: "150px",
    cellStyle: { 'justify-content': 'flex-start', 'padding': '10px'},
    headerComponentParams : {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        '</div>'
    },
    autoHeight: true
  },
];

export default columnDefs;
