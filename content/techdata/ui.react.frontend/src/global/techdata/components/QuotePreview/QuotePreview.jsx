import React, { Element } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import QuotePreviewContinue from './QuotePreviewContinue';

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const apiResponse = useGet(componentProp.uiServiceEndPoint);

  return (
    <div className="cmp-quote-preview">
      {apiResponse && (
        <section>
          <div className="cmp-quote-preview__note">
            <QuotePreviewNote note={componentProp.note} />
          </div>
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              gridProps={componentProp.productLines}
              data={apiResponse}
            ></QuotePreviewGrid>
          </div>
          <QuotePreviewContinue gridProps={componentProp}/>
        </section>
      )}
    </div>
  );
}

export default QuotePreview;
