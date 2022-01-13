import React, { useCallback, useState, useEffect } from "react";
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
import { isPricingOptionsRequired, isAllowedQuantityIncrease, isDealRequired, isEndUserMissing } from "./QuoteTools";
import Modal from '../Modal/Modal';

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const URL_QUOTES_GRID = componentProp.successRedirectPage ? componentProp.successRedirectPage : '#';
  const { id, isEstimateId = true, vendor = 'cisco' } = getUrlParams();
  const [apiResponse, isLoading] = useGet(`${componentProp.uiServiceEndPoint}?id=${id}&isEstimateId=${isEstimateId}&vendor=${vendor}`);
  const currencySymbol = apiResponse?.content?.quotePreview?.quoteDetails.currencySymbol || '$';
  const [quoteDetails, setQuoteDetails] = useState({});
  const [loadingCreateQuote, setLoadingCreateQuote] = useState(false);
  const [didQuantitiesChange, setDidQuantitiesChange] = useState(false);
  const [quoteWithoutPricing, setQuoteWithoutDealPricing] = useState(false);
  const [quoteWithoutDeal, setQuoteWithoutDeal] = useState(false);
  const [quoteWithoutEndUser, setQuoteWithoutEndUser] = useState(true);
  const [modal, setModal] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;

  useEffect(() => {
    if(apiResponse?.content?.quotePreview?.quoteDetails) {
      setQuoteDetails(apiResponse?.content?.quotePreview?.quoteDetails);
    }
  }, [apiResponse]);

  const showSimpleModal = (title, content, onModalClosed=closeModal) =>
    setModal((previousInfo) => ({
      content: content,
      properties: {
          title:  title,
      },
      onModalClosed,
      ...previousInfo,
    })
  );

  const closeModal = () => setModal(null);
  const showErrorModal = () => showSimpleModal('Create Quote', (
    <div>There has been an error creating your quote. Please try again later or contact your sales representative.</div>
  ));

  const onGridUpdate = (data, didQuantitiesChange) => {
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

  const createQuote = async (quoteDetailsResponse) => {
    try {
      setLoadingCreateQuote(true);
      let { activeCustomer = false } = JSON.parse(localStorage.getItem("userData"));
      const { name, number } = activeCustomer;
      const quoteDetails = { ...quoteDetailsResponse };
      if (quoteDetails.reseller && quoteDetails.reseller.length > 0 && activeCustomer) {
        quoteDetails.reseller[0] = { ...quoteDetails.reseller[0], id: number, name }
      }

      const result = await usPost(componentProp.quickQuoteEndpoint, {quoteDetails});

      if (!result.data?.error?.isError && result.data?.content?.confirmationId) {
        const { confirmationId } = result.data.content;
        showSimpleModal('Create Quote', (
          <div>Your quote is being created and will be available in a few minutes - confirmationId:{confirmationId}</div>
        ), onModalClosed => {
          closeModal();
          window.location.href = URL_QUOTES_GRID;
        });
      }
      else {
        showErrorModal();
      }

      return result.data;
    } catch( error ) {
      showErrorModal();

      return error;
    } finally {
      setLoadingCreateQuote(false);
    }
  };

  const scrollToTopError = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleQuickQuote = useCallback((e) => {
    const pricingRequired = isPricingOptionsRequired(quoteDetails, true),
          dealRequired = isDealRequired(quoteDetails, true),
          userMissingFields = isEndUserMissing(quoteDetails, true);

    tryCreateQuote(e, pricingRequired, dealRequired, userMissingFields, quoteDetails);
  }, [quoteDetails]);

  const handleQuickQuoteWithoutDeals = (e) => {
    const pricingRequired = isPricingOptionsRequired(quoteDetails, true),
          userMissingFields = isEndUserMissing(quoteDetails, true);

    const quoteDetailsCopy = { ...quoteDetails };

    // remove deal if present
    if (quoteDetailsCopy.hasOwnProperty("deal")) {
      delete quoteDetailsCopy.deal;
    }

    tryCreateQuote(e, pricingRequired, false, userMissingFields, quoteDetailsCopy);
  };

  const tryCreateQuote = (e, pricingRequired, dealRequired, userMissingFields, quote) => {
    if(pricingRequired || dealRequired || userMissingFields) {
      scrollToTopError();
      e.preventDefault();

      setQuoteWithoutEndUser(userMissingFields);
      setQuoteWithoutDealPricing(pricingRequired);
      setQuoteWithoutDeal(dealRequired);
    }
    else {
      createQuote(quote);
    }
  }

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
    setQuoteWithoutEndUser(false);
    setQuoteDetails((previousQuoteDetails) => (
      {
        ...previousQuoteDetails,
        endUser: [endUserlInformation],
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
            isDealRequired={isDealRequired(quoteDetails, quoteWithoutDeal)}
            isPricingOptionsRequired={isPricingOptionsRequired(quoteDetails, quoteWithoutPricing)}
            isEndUserMissing={isEndUserMissing(quoteDetails, quoteWithoutEndUser)}
            gridProps={componentProp}
            quoteDetails={quoteDetails}
            endUserInfoChange={endUserInfoChange}
            generalInfoChange={generalInfoChange}
            companyInfoChange={companyInfoChange}
          />
          <div className="cmp-quote-preview__note">
            <QuotePreviewNote note={componentProp.note} />
          </div>
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              isAllowedQuantityIncrease={isAllowedQuantityIncrease(quoteDetails)}
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
            disableQuickQuoteButton={false}
            handleQuickQuote={handleQuickQuote}
            handleQuickQuoteWithoutDeals={handleQuickQuoteWithoutDeals}/>
        </section>
      )}
      {modal && <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={modal.onModalClosed}
      ></Modal>}
    </div>
  );
}

export default QuotePreview;


