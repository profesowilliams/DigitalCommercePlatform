import React, { Element, useCallback, useState } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import QuotePreviewContinue from './QuotePreviewContinue';
import QuotePreviewSubTotal from "./QuotePreviewSubTotal";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import { getUrlParams } from "../../../../utils";
import axios from 'axios';
import data from './QuotePreviewSample';
import Loader from '../Widgets/Loader';

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const getDetailsId = ({ id, isEstimateId }) => [id, isEstimateId];
  const [id, isEstimateId] = getDetailsId(getUrlParams());
  const [apiResponse, isLoading] = useGet(`${componentProp.uiServiceEndPoint}?id=${id}&isEstimateId=${isEstimateId || true}`);
  const currencySymbol = apiResponse?.content?.quotePreview?.quoteDetails.currencySymbol || '$';
  const [subTotal, setSubTotal] = useState(null);

  const getSubTotal = (data) => {
    let subTotal = data.reduce((subTotal, {extendedPrice}) => subTotal + extendedPrice, 0);
    subTotal = Math.round((subTotal + Number.EPSILON) * 100) / 100

    setSubTotal(subTotal);
  };

  const handleQuickQuote = useCallback(async (e) => {
    e.preventDefault();
    const params = {
      method: 'POST',
      url: componentProp.quickQuoteEndpoint,
      headers: {
        accept: '*/*'
      },
      body: data,
    };

    try {
      const result = await axios.request(params);
      console.log(result.data);
      return result.data;
    } catch( error ) {
      console.log(error);
      return error;
    }
  }, [data]);

  return (
    <div className="cmp-quote-preview">
      <Loader visible={isLoading} />
      {apiResponse && !isLoading && (
        <section>
          <ConfigGrid gridProps={componentProp}/>
          <div className="cmp-quote-preview__note">
            <QuotePreviewNote note={componentProp.note} />
          </div>
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              gridProps={componentProp.productLines}
              data={apiResponse}
              onQuoteLinesUpdated={getSubTotal}
            ></QuotePreviewGrid>
            <QuotePreviewSubTotal 
              currencySymbol={currencySymbol} 
              subTotal={subTotal}
              subtotalLabel={componentProp.subtotalLabel}
            />
          </div>
          <QuotePreviewContinue gridProps={componentProp} handleQuickQuote={handleQuickQuote}/>
        </section>
      )}
    </div>
  );
}

export default QuotePreview;
