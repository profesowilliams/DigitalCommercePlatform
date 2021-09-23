import React, { Element, useCallback, useState, useEffect } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import QuotePreviewContinue from './QuotePreviewContinue';
import QuotePreviewSubTotal from "./QuotePreviewSubTotal";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import { getUrlParams } from "../../../../utils";
import { waitFor } from "../../../../utils/utils";
import axios from 'axios';
import data from './QuotePreviewSample';
import Loader from '../Widgets/Loader';
import FullScreenLoader from '../Widgets/FullScreenLoader';

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const { id, isEstimateId, vendor } = getUrlParams();
  const [apiResponse, isLoading] = useGet(`${componentProp.uiServiceEndPoint}?id=${id}&isEstimateId=${isEstimateId || true}&vendor=${vendor ? vendor : 'cisco'}`);
  const currencySymbol = apiResponse?.content?.quotePreview?.quoteDetails.currencySymbol || '$';
  const [subTotal, setSubTotal] = useState(null);
  const [quoteDetails, setQuoteDetails] = useState({});
  const [loadingCreateQuote, setLoadingCreateQuote] = useState(false);

  useEffect(() => {
    if(apiResponse?.content?.quotePreview?.quoteDetails) {
      setQuoteDetails(apiResponse?.content?.quotePreview?.quoteDetails);
    }
  }, [apiResponse]); 

  const getSubTotal = (data) => {
    let subTotal = data.reduce((subTotal, {extendedPrice}) => subTotal + extendedPrice, 0);
    subTotal = Math.round((subTotal + Number.EPSILON) * 100) / 100

    setSubTotal(subTotal);
  };

  const createQuote = async (e) => {
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
      setLoadingCreateQuote(true);
      // dummy timeout to delay API call and see loader.
      await waitFor(3000);
      const result = await axios.request(params);
      return result.data;
    } catch( error ) {
      return error;
    } finally {
      setLoadingCreateQuote(false);
    }
  };

  const handleQuickQuote = useCallback(createQuote, [data, loadingCreateQuote]);

  const generalInfoChange = (generalInformation) =>{
    setQuoteDetails((previousQuoteDetails) => (
      {
        ...previousQuoteDetails,
        tier: generalInformation.tier,
        spaId: generalInformation.spaId,
        quoteReference: generalInformation.quoteReference,
      }
    ));
  }

  const endUserInfoChange = (endUserlInformation) =>{
    setQuoteDetails((previousQuoteDetails) => (
      {
        ...previousQuoteDetails,
        endUser: endUserlInformation,
      }
    ));
    console.log(endUserlInformation);
  }

  return (
    <div className="cmp-quote-preview">
      <Loader visible={isLoading} />
      {loadingCreateQuote && (
        <FullScreenLoader>
          Creating Quick Quote...
        </FullScreenLoader>
      )}
      {apiResponse && !isLoading && (
        <section>
          <ConfigGrid
            gridProps={componentProp}
            quoteDetails={quoteDetails}
            endUserInfoChange={endUserInfoChange}
            generalInfoChange={generalInfoChange}
          />
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
