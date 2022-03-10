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
    width: "120px",
    sortable: false,
  },
  {
    headerName: "Product details",
    field: "shortDescription",
    sortable: false,
    width: "300px",
  },
  {
    headerName: "Mfr. part №",
    field: "mfrNumber",
    sortable: false,
    width: "200px",
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
    width: "100px",
  },
  {
    headerName: "Total (USD)",
    field: "totalPrice",
    sortable: false,
    width: "150px",
  },
];

export default columnDefs;
