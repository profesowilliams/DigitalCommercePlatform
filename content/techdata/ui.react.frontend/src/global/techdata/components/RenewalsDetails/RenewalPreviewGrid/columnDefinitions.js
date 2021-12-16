const columnDefs = [
  {
    headerName: "Line",
    field: "id",
    width: "100px",
    sortable: false,
  },
  {
    headerName: "Product family",
    field: "vendorPartNo",
    sortable: false,
  },
  {
    headerName: "Product details",
    field: "shortDescription",
    sortable: false,
    width: "600px",
  },
  {
    headerName: "Mfr. part №",
    field: "mfrNumber",
    sortable: false,
    width: "400px",
  },
  {
    headerName: "Unit price (USD)",
    field: "unitPrice",
    sortable: false,
  },
  {
    headerName: "Quantity",
    field: "quantity",
    sortable: false,
  },
  {
    headerName: "Total (USD)",
    field: "totalPrice",
    sortable: false,
  },
];

export default columnDefs;
