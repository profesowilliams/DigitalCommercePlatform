import React from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import Loader from '../Widgets/Loader';

function QuotePreview(props) {
  const {uiServiceEndPoint, note, productLines} = JSON.parse(props.componentProp);
  const [loading, apiResponse] = useGet(uiServiceEndPoint);

  return (
    <div className="cmp-quote-preview">
      {loading && <Loader visible={true} />}
      {apiResponse && (
        <section>
          <div className="cmp-quote-preview__note">
            <QuotePreviewNote note={note} />
          </div>
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              gridProps={productLines}
              data={apiResponse}
            ></QuotePreviewGrid>
          </div>
        </section>
      )}
    </div>
  );
}

export default QuotePreview;
