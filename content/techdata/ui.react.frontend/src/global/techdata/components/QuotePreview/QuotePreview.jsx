import React, { useCallback, useState, useEffect } from "react";
import useGet from "../../hooks/useGet";
import QuotePreviewGrid from "./ProductLines/ProductLinesGrid";
import QuotePreviewNote from "./QuotePreviewNote";
import ModalQuoteCreateModal from "./ModalQuoteCreateModal";
import QuotePreviewContinue from './QuotePreviewContinue';
import QuotePreviewSubTotal from "./QuotePreviewSubTotal";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import { getUrlParams } from "../../../../utils";
import { usPost } from "../../../../utils/api";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import { isPricingOptionsRequired, isAllowedQuantityIncrease, isDealRequired, isEndUserMissing, isDealSelectorHidden, isDealConfiguration } from "./QuoteTools";
import Modal from '../Modal/Modal';
import { pushEvent } from '../../../../utils/dataLayerUtils';
import { LOCAL_STORAGE_KEY_USER_DATA, QUOTE_PREVIEW_AVT_TYPE_VALUE, QUOTE_PREVIEW_DEAL_TYPE } from "../../../../utils/constants";
import { isNotEmptyValue } from "../../../../utils/utils";

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
  const [isExclusiveFlag, setIsExclusiveFlag] = useState(false);
  const [systemInfoDone, setSystemInfoDone] = useState(false);
  const [dealType, setDealType] = useState('');
  const [tier, setTier] = useState('');

  const modalConfig = componentProp?.modalConfig;

  /**
   * Getting the value to know if the quote is exclusive
   */
  useEffect(() => {
    if (apiResponse) {
      const isExclusive = apiResponse?.content?.quotePreview?.quoteDetails.isExclusive;
      setIsExclusiveFlag(isExclusive ? true : false);
      setDealType(isNotEmptyValue(apiResponse?.content?.quotePreview?.quoteDetails?.source?.type)) ? apiResponse?.content?.quotePreview?.quoteDetails?.source?.type : '';
      setTier(isNotEmptyValue(apiResponse?.content?.quotePreview?.quoteDetails.tier) ? apiResponse?.content?.quotePreview?.quoteDetails.tier : '');
    }
  }, [apiResponse]);

  //Please do not change the below method without consulting your Dev Lead
  function invokeModal(modal) {
    setModal(modal);
  }
  const DEAL_ATTRIBUTE_FIELDNAME = "DEALIDENTIFIER";

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

  /**
   * Function that format the quote-Object and send to a service
   * that save for the system and return the quoteID to show to 
   * the end user and redirect to ordersGrid
   * @param {any} quoteDetailsResponse 
   * @param {string} buyMethodParam 
   * @returns 
   */
  const createQuote = async (quoteDetailsResponse, buyMethodParam = '') => {
    try {
      setLoadingCreateQuote(true);
      let { activeCustomer = null } = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));
      const { name, number } = activeCustomer;
      const quoteDetails = { ...quoteDetailsResponse };
      if (quoteDetails.reseller && quoteDetails.reseller.length > 0 && activeCustomer) {
        quoteDetails.reseller[0] = { ...quoteDetails.reseller[0], id: number, name }
      }

      if (quoteDetails.buyMethod && buyMethodParam !== '' && activeCustomer) {
        quoteDetails.buyMethod = buyMethodParam;
      } else if (dealType === QUOTE_PREVIEW_DEAL_TYPE) {
        quoteDetails.buyMethod = QUOTE_PREVIEW_AVT_TYPE_VALUE; // In case of the dealType are "Deal" force the buyMethod value to tdavnet67
      }
      const result = await usPost(componentProp.quickQuoteEndpoint, {quoteDetails});
      if (!result.data?.error?.isError && result.data?.content?.confirmationId) {
        const { confirmationId } = result.data.content;
        showSimpleModal('Quote Submitted Successfully', (
          <div>Your quote is being created and will be available for your viewing in a few minutes. Quote Confirmation ID: {confirmationId}</div>
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

  /**
   * Function that validate if the quote have the field
   * isExclusive true and show a modal to select the
   * SAP system and keep the logic
   * @param {any} quoteParam 
   */
  const validateCreateQuoteSystem = (quoteParam) => {
    if (!isExclusiveFlag && dealType !== QUOTE_PREVIEW_DEAL_TYPE) {
      showSimpleModal('Create Quote', (
        <ModalQuoteCreateModal 
          setSystemInfoDone={setSystemInfoDone} 
          createQuote={createQuote} 
          quoteDetails={quoteParam} 
          setModal={setModal}
          modalConfig={modalConfig}
        />
      ), onModalClosed => closeModal());
    } else {
      createQuote(quoteParam)
    }
  };

  const handleQuickQuote = useCallback(() => {
    const pricingRequired = isPricingOptionsRequired(quoteDetails, true),
          dealRequired = isDealRequired(quoteDetails, true),
          userMissingFields = isEndUserMissing(quoteDetails, true);

    if(pricingRequired || dealRequired || userMissingFields) {
      scrollToTopError();

      setQuoteWithoutEndUser(userMissingFields);
      setQuoteWithoutDealPricing(pricingRequired);
      setQuoteWithoutDeal(dealRequired);
    }

    
    tryCreateQuote(pricingRequired, dealRequired, userMissingFields, quoteDetails);
  }, [quoteDetails]);

  const handleQuickQuoteWithoutDeals = (e) => {
    const pricingRequired = isPricingOptionsRequired(quoteDetails, true),
          userMissingFields = isEndUserMissing(quoteDetails, true);

    const quoteDetailsCopy = { ...quoteDetails };

    // remove deal if present
    if (!isDealConfiguration(quoteDetails.source) && quoteDetailsCopy.hasOwnProperty("deal")) {
      delete quoteDetailsCopy.deal;

      quoteDetailsCopy.attributes = quoteDetailsCopy.attributes?.filter((attribute) => attribute.name.toUpperCase() !== DEAL_ATTRIBUTE_FIELDNAME);
    }
    tryCreateQuote(pricingRequired, false, userMissingFields, quoteDetailsCopy);
  };
  

  const tryCreateQuote = (pricingRequired, dealRequired, userMissingFields, quote) => {
    if(pricingRequired || dealRequired || userMissingFields) {
      scrollToTopError();

      setQuoteWithoutEndUser(userMissingFields);
      setQuoteWithoutDealPricing(pricingRequired);
      setQuoteWithoutDeal(dealRequired);
    } else {
      if (!isExclusiveFlag && !systemInfoDone) {
        validateCreateQuoteSystem(quote);
      } else {
        createQuote(quote);
      }
    }
  }

  const generalInfoChange = (generalInformation) =>{
    setQuoteDetails((previousQuoteDetails) => {
      setDealApplyAnalytics(generalInformation);
      let newGeneralDetails = {
        ...previousQuoteDetails,
        tier: generalInformation.tier,
        spaId: generalInformation.spaId,
        quoteReference: generalInformation.quoteReference,
        deal: generalInformation.deal,
      }

      newGeneralDetails.endUser = newGeneralDetails.endUser || [];
      newGeneralDetails.endUser[0] = newGeneralDetails.endUser.length > 0 ? newGeneralDetails.endUser[0] : {};

      if(generalInformation.deal?.endUserName
        && generalInformation.deal.endUserName.trim().length > 0) {
        newGeneralDetails.endUser[0].companyName = generalInformation.deal.endUserName;
      }

      newGeneralDetails.attributes = newGeneralDetails.attributes || [];
      let dealIdAttribute = newGeneralDetails.attributes.filter((attribute) => attribute.name.toUpperCase() === DEAL_ATTRIBUTE_FIELDNAME);

      if (dealIdAttribute.length === 0) {
        dealIdAttribute = [{ name: DEAL_ATTRIBUTE_FIELDNAME }];

        newGeneralDetails.attributes.push(dealIdAttribute[0]);
      }

      dealIdAttribute[0].value = generalInformation.deal.dealId;

      return newGeneralDetails;
    });
  }

  const setDealApplyAnalytics = (generalInfo) => {
    pushEvent(
      "qpDealApply",
      null,
      {
        quotePreview: {
          dealId: generalInfo.deal.dealId || "",
          genTier: generalInfo.tier || "",
        },
      }
    );
  };

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
          Please wait while Your Quote is created
        </FullScreenLoader>
      )}
      {apiResponse && !isLoading && (
        <section>
          <ConfigGrid
            hideDealSelector={isDealSelectorHidden(quoteDetails)}
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
              tier={tier}
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
            handleQuickQuoteWithoutDeals={handleQuickQuoteWithoutDeals}
            apiResponse={apiResponse}
            isConfig={isEstimateId}
            />
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
