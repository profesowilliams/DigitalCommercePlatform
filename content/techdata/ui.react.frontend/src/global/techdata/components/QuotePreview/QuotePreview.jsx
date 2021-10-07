import React, { Element, useCallback, useState, useEffect } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import QuotePreviewContinue from './QuotePreviewContinue';
import QuotePreviewSubTotal from "./QuotePreviewSubTotal";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import { getUrlParams } from "../../../../utils";
import { waitFor } from "../../../../utils/utils";
import { usPost } from "../../../../utils/api";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import { isQuickQuoteButtonDisabled, isDealSelectorHidden } from "./QuoteTools";

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const { id, isEstimateId = true, vendor = 'cisco' } = getUrlParams();
  const [apiResponse, isLoading] = useGet(`${componentProp.uiServiceEndPoint}?id=${id}&isEstimateId=${isEstimateId}&vendor=${vendor}`);
  const currencySymbol = apiResponse?.content?.quotePreview?.quoteDetails.currencySymbol || '$';
  const [quoteDetails, setQuoteDetails] = useState({});
  const [loadingCreateQuote, setLoadingCreateQuote] = useState(false);
  const [didQuantitiesChange, setDidQuantitiesChange] = useState(false);

  useEffect(() => {
    if(apiResponse?.content?.quotePreview?.quoteDetails) {
      setQuoteDetails(apiResponse?.content?.quotePreview?.quoteDetails);
    }
  }, [apiResponse]);

  const onGridUpdate = (data) => {
    let subTotal = data.reduce((subTotal, {extendedPrice}) => subTotal + extendedPrice, 0);
    subTotal = Math.round((subTotal + Number.EPSILON) * 100) / 100

    setQuoteDetails((previousQuoteDetails) => ({
      ...previousQuoteDetails,
      subTotal: subTotal,
      Currency: currencySymbol,
      items: data,
    }));
    setDidQuantitiesChange(didQuantitiesChange);
  };

  const createQuote = async (e) => {
    e.preventDefault();
    const params = quoteDetails;

    try {
      setLoadingCreateQuote(true);
      // dummy timeout to delay API call and see loader. DELETE AFTER TESTING
      await waitFor(1000);
      const result = await usPost(componentProp.quickQuoteEndpoint, params);
      return result.data;
    } catch( error ) {
      return error;
    } finally {
      setLoadingCreateQuote(false);
    }
  };

  const handleQuickQuote = useCallback(createQuote, [quoteDetails, loadingCreateQuote]);

  const generalInfoChange = (generalInformation) =>{
    setQuoteDetails((previousQuoteDetails) => (
      {
        ...previousQuoteDetails,
        tier: generalInformation.tier,
        spaId: generalInformation.spaId,
        quoteReference: generalInformation.quoteReference,
        deal: generalInformation.deal,
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
            hideDealSelector={isDealSelectorHidden(quoteDetails)}
          />
          <div className="cmp-quote-preview__note">
            <QuotePreviewNote note={componentProp.note} />
          </div>
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              gridProps={componentProp.productLines}
              data={quoteDetails}
              onQuoteLinesUpdated={onGridUpdate}
            ></QuotePreviewGrid>
            <QuotePreviewSubTotal 
              currencySymbol={currencySymbol} 
              subTotal={quoteDetails.subTotal}
              subtotalLabel={componentProp.subtotalLabel}
            />
          </div>
          <QuotePreviewContinue
            gridProps={componentProp}
            quoteDetails={quoteDetails}
            disableQuickQuoteButton={isQuickQuoteButtonDisabled(quoteDetails, didQuantitiesChange)}
            handleQuickQuote={handleQuickQuote}/>
        </section>
      )}
    </div>
  );
}

export default QuotePreview;
