import React from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const apiResponse = useGet(componentProp.uiServiceEndPoint);

  return (
    <div className="cmp-quote-preview">
      {apiResponse && (
        <div className="cmp-quote-preview__lines">
          <QuotePreviewGrid
            gridProps={componentProp.productLinesGrid}
            data={apiResponse}
          ></QuotePreviewGrid>
        </div>
      )}
    </div>
  );
}

export default QuotePreview;
