import React, { useEffect, useMemo } from "react";
import Grid from "../../Grid/Grid";
import ImageLineInformation from "../../QuotePreview/ProductLines/ImageLineItemInformation";
import ProductLinesItemInformation from "../../QuotePreview/ProductLines/ProductLinesItemInformation";

function ProductLinesChildGrid({ data, columns, columnDefiniton, ...rest }) {
  const imageField = {
    headerName:'image',
    field:'imageGhost',
    sortable:false,
    width:'130px',
    cellHeight: () => 80,
    cellRenderer: (props) => <ImageLineInformation line={props.data}/>
  }

  const cols = useMemo(function(){  
    let colsList = columnDefiniton.map((col) => {
      col.field === "id" &&
        (col.cellRenderer = (props) => {
          return <section style={{ marginLeft: "32px" }}>{props.value}</section>;
        });
      col.expandable = false;
      delete col.detailRenderer;      
      if (col.field === "shortDescription"){
        col.width = "350px";
        (col.cellRenderer = (props) => <ProductLinesItemInformation line={props.data} isChild={true} />);
      }
      return col;
    });
    const colsCopy = [...colsList];
    const hasShortDescription = colsCopy.find(col => col.field === "shortDescription");
    if (hasShortDescription) colsCopy.splice(1,0,imageField);
    return colsCopy;
  },[columnDefiniton])
  
  const addImageField = React.useCallback ((columnConfigList=[])=>{
    let colsCopyConfigList = [];
    if (!columnConfigList.length){
      const columnsDefaults = cols.map(({field,sortable}) => ({columnKey:field,sortable}));
      return columnsDefaults;
    } else {
      const imgCol = {columnKey:"imageGhost", sortable:false};
      const columnsCopy = [...colsCopyConfigList];
      columnsCopy.splice(1,0,imgCol);
      return columnsCopy;
    }
   },[columns] )

   const adjustWidthIfImage = React.useCallback ((cols)=>{
     const hasImageCol = cols.find(col => col.field === "imageGhost");
     if (hasImageCol) {
       const descColIndex = cols.findIndex(col => col.field === "shortDescription");
       cols[descColIndex].width = "450px";
       return cols;
     }else {
       return cols;
     }
   } ,[cols])

  return (
    <section>
      <div className="cmp-product-lines-grid__child-grid">
        <Grid
          columnDefinition={adjustWidthIfImage(cols)}
          config={{
            columnList: addImageField(columns),
            serverSide: false,
            paginationStyle: "none",
          }}
          data={data}
          showHeader={false}
          {...rest}
        ></Grid>
      </div>
    </section>
  );
}


export default ProductLinesChildGrid;
