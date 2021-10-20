import React, { Element, useCallback, useState, useEffect } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import QuotePreviewContinue from './QuotePreviewContinue';
import QuotePreviewSubTotal from "./QuotePreviewSubTotal";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import { getUrlParams } from "../../../../utils";
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

  const createQuote = async (quoteDetails) => {
    try {
      setLoadingCreateQuote(true);
      const result = await usPost(componentProp.quickQuoteEndpoint, quoteDetails);
      if (result.data?.content) {
        /** TODO: next steps with quoteId & confirmationId
         * Next screens are not refined, will show confirmation via alert
         * for now. This will be replaced with new logic at a later time.
         */
        if (result.data.content.quoteId && window) {
          window.alert("Deal applied");
        }
      }
      return result.data;
    } catch( error ) {
      return error;
    } finally {
      setLoadingCreateQuote(false);
    }
  };

  const handleQuickQuote = useCallback(() => createQuote(quoteDetails), [quoteDetails]);

  const handleQuickQuoteWithoutDeals = (e) => {
    e.preventDefault();
    const quoteDetailsCopy = { ...quoteDetails };

    // remove deal if present
    if (quoteDetailsCopy.hasOwnProperty("deal")) {
      delete quoteDetailsCopy.deal;
    }
    createQuote(quoteDetailsCopy);
  };

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

  /**
   * The keys for company info (reseller) from API response is different when compared to
   * response obtained from getAddress API call. Manually mapping to exact keys in
   * the client side.
   *
   * Since selected address maybe entirely new address and we don't want to mix up
   * keys from original address, we just replace the old with new but retaining same keys.
   */
  const companyInfoChange = (selectedCompanyInfo) => {
    setQuoteDetails((previousQuoteDetails) => ({
      ...previousQuoteDetails,
      reseller: [
        {
          addressNumber: selectedCompanyInfo.addressNumber,
          name: selectedCompanyInfo.name,
          line1: selectedCompanyInfo.addressLine1,
          city: selectedCompanyInfo.city,
          state: selectedCompanyInfo.state,
          zip: selectedCompanyInfo.zip,
          country: selectedCompanyInfo.country,
          email: selectedCompanyInfo.email,
          phoneNumber: selectedCompanyInfo.phone,
          postalCode: selectedCompanyInfo.zip,
          salesOrganization: selectedCompanyInfo.salesOrganization,
        },
      ],
    }));
  };

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
            companyInfoChange={companyInfoChange}
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
            handleQuickQuote={handleQuickQuote}
            handleQuickQuoteWithoutDeals={handleQuickQuoteWithoutDeals}/>
        </section>
      )}
    </div>
  );
}

export default QuotePreview;
