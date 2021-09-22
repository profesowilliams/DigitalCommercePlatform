import React,{useCallback, useMemo} from "react";
import Grid from "../../Grid/Grid";
import ProductLinesItemInformation from "./ProductLinesItemInformation";
import thousandSeparator from "../../../helpers/thousandSeparator";
import ImageLineInformation from "./ImageLineItemInformation";

function ProductLinesChildGrid({ data, columns }) {
  const columnDefs = [
    {
      field: "id",
      sortable: false,
      width: "146px",
      rowClass: ({ node, data }) => "cmp-product-lines-grid__child-grid__row",
      cellRenderer: (props) => {
        return <section style={{ marginLeft: "60px" }}>{props.value}</section>;
      },
    },
    {
      field:'imageGhost',
      sortable:false,
      width:'100px',
      cellHeight: () => 80,
      cellRenderer: (props) => <ImageLineInformation line={props.data}/>
    },
    {
      field: "shortDescription",
      sortable: false,
      width: "333px",
      cellHeight: () => 80,
      cellRenderer: (props) => {
        return <ProductLinesItemInformation line={props.data} isChild={true} />;
      },
    },
    {
      field: "unitListPriceFormatted",
      sortable: false,
    },
    {
      field: "quantity",
      sortable: false,
      width: "120px",
    },
    {
      field: "extendedPriceFormatted",
      sortable: false,
      valueFormatter: ({ data }) => {
        return "$" + thousandSeparator(data.unitPrice * data.quantity);
      },
    },
  ];
 const addImageField = useCallback((columns)=>{
   const columnsCopy = [...columns]; 
   const hasShortDescription = columns.find(col => col.columnKey === "shortDescription");
   if (hasShortDescription){
     const imgField = {columnKey:'imageGhost', sortable:false};
     columnsCopy.splice(1,0,imgField);
   }
   return columnsCopy;
  },[columns])
  return (
    <section>
      <div className="cmp-product-lines-grid__child-grid">
        <Grid
          columnDefinition={columnDefs}
          config={{
            columnList: addImageField(columns),
            serverSide: false,
            paginationStyle: "none",
          }}
          data={data}
          showHeader={false}
        ></Grid>
      </div>
    </section>
  );
}

export default ProductLinesChildGrid;
