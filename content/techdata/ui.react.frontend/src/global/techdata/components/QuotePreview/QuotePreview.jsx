import React, { Element, useState } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import QuotePreviewContinue from './QuotePreviewContinue';
import QuotePreviewSubTotal from "./QuotePreviewSubTotal";
import ConfigGrid from "./ConfigGrid/ConfigGrid";

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const apiResponse = useGet(componentProp.uiServiceEndPoint);
  const [subTotal, setSubTotal] = useState(null);

  const getSubTotal = (data) => {
    let subTotal = data.reduce((subTotal, {extendedPrice}) => subTotal + extendedPrice, 0);
    subTotal = Math.round((subTotal + Number.EPSILON) * 100) / 100

    setSubTotal(subTotal);
  };

  return (
    <div className="cmp-quote-preview">
      {apiResponse && (
        <section>
          <ConfigGrid />
          <div className="cmp-quote-preview__note">
            <QuotePreviewNote note={componentProp.note} />
          </div>
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              gridProps={componentProp.productLines}
              data={apiResponse}
              onQuoteLinesUpdated={getSubTotal}
            ></QuotePreviewGrid>
            <QuotePreviewSubTotal subTotal={subTotal}/>
          </div>
          <QuotePreviewContinue gridProps={componentProp}/>
        </section>
      )}
    </div>
  );
}

export default QuotePreview;
