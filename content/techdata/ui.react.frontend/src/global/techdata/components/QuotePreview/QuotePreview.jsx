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
import {
  isPricingOptionsRequired,
  isAllowedQuantityIncrease,
  isDealRequired,
  isEndUserMissing,
  isDealSelectorHidden,
  isDealConfiguration,
  isTechDataDistiBuy,
  isAVTTechDistiBuy,
  isTechDataCustomerMethod,
  isAVTTechCustomerMethod,
  compareBuyMethod,
  isTechDataAndAVTTechCustomerMethod
} from "./QuoteTools";
import Modal from '../Modal/Modal';
import { pushEvent } from '../../../../utils/dataLayerUtils';
import { 
  LOCAL_STORAGE_KEY_USER_DATA,
  QUOTE_PREVIEW_AVT_TYPE_VALUE,
  QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE,
  QUOTE_PREVIEW_CREATE_POPUP_ACTION,
  QUOTE_PREVIEW_TECH_DATA,
  QUOTE_PREVIEW_AVT_TECHNOLOGY,
  QUOTE_PREVIEW_TECH_DATA_CUSTOMER_METHOD,
  QUOTE_PREVIEW_AVT_TECHNOLOGY_CUSTOMER_METHOD,
} from "../../../../utils/constants";
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
  const [showPopUp, setShowPopUp] = useState(false);
  const [tier, setTier] = useState('');
  const modalConfig = componentProp?.modalConfig;
  const DEAL_ATTRIBUTE_FIELDNAME = "DEALIDENTIFIER";

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;
  
  /**
   * 
   * @param {string} distiBuyMethodParam 
   * @param {string} customerBuyMethod 
   * @param {string} buyMethodParam
   * @returns {string}
   */
  const setQuoteDetailsEffect = (distiBuyMethodParam, customerBuyMethod, buyMethodParam) => {
    return isTechDataDistiBuy(distiBuyMethodParam) && isTechDataCustomerMethod(customerBuyMethod) ? 
              QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE : 
              isAVTTechDistiBuy(distiBuyMethodParam) && isAVTTechCustomerMethod(customerBuyMethod) ? 
                QUOTE_PREVIEW_AVT_TYPE_VALUE :
                buyMethodParam;
  };

  /**
   * Getting the values of the Quote
   */
  useEffect(() => {
    const quoteDetailsResponse = apiResponse?.content?.quotePreview?.quoteDetails;
    if(quoteDetailsResponse) {
      const customerBuyMethod =  quoteDetailsResponse.customerBuyMethod;
      const distiBuyMethodParam = isNotEmptyValue(quoteDetailsResponse.distiBuyMethod) ? quoteDetailsResponse.distiBuyMethod : '';
      // setShowPopUp(isTechDataAndAVTTechCustomerMethod(customerBuyMethod)); // Flag to know if need to show the popup
      setTier(isNotEmptyValue(quoteDetailsResponse.tier) ? quoteDetailsResponse.tier : '');
      // set buy Method to “sap46” or set buy Method to “tdavnet67” in some specific cases
      quoteDetailsResponse.buyMethod = setQuoteDetailsEffect(distiBuyMethodParam, customerBuyMethod, quoteDetailsResponse.buyMethod);
      setQuoteDetails(quoteDetailsResponse);
      // Show Modal When Quote Cannot Be Created.
      if (cannotCreateQuote(quoteDetailsResponse)) {
        showCannotCreateQuoteForDeal();
      }
      setFlagDeal(!isDealConfiguration(quoteDetailsResponse.source));
    }
  }, [apiResponse]);

  /**
   * In case of the distribution buy method is not AVT or TECH DATA. 
   * Or if it is AVT or TECH DATA but the customer buy method does not match. 
   * @param {any} quoteDetailsResponse 
   * @returns 
   */
  const cannotCreateQuote = (quoteDetailsResponse) => {
    const distiBuyMethod = isNotEmptyValue(quoteDetailsResponse.distiBuyMethod) ? quoteDetailsResponse.distiBuyMethod : '';
    const customerBuyMethod = isNotEmptyValue(quoteDetailsResponse.customerBuyMethod) ? quoteDetailsResponse.customerBuyMethod : '';
   
    // DistiBuyMethod = “TECH DATA” and CustomerBuyMethod = "AVT"
    const firstCondition = compareBuyMethod(distiBuyMethod, QUOTE_PREVIEW_TECH_DATA) && compareBuyMethod(customerBuyMethod, QUOTE_PREVIEW_AVT_TECHNOLOGY_CUSTOMER_METHOD);

    // DistiBuyMethod = “AVT Technology Solutions LLC” and CustomerBuyMethod = "TD"
    const secondCondition = compareBuyMethod(distiBuyMethod, QUOTE_PREVIEW_AVT_TECHNOLOGY) && compareBuyMethod(customerBuyMethod, QUOTE_PREVIEW_TECH_DATA_CUSTOMER_METHOD);

    // DistiBuyMethod value is not “TECH DATA” or  “AVT Technology Solutions LLC”
    const thirdCondition = !compareBuyMethod(distiBuyMethod, QUOTE_PREVIEW_TECH_DATA) && !compareBuyMethod(distiBuyMethod, QUOTE_PREVIEW_AVT_TECHNOLOGY);

    return isDealConfiguration(quoteDetailsResponse.source) && (firstCondition || secondCondition|| thirdCondition);
    
  }
    
    


  const showSimpleModal = (title, content, onModalClosed=closeModal, buttonLabel, modalAction) =>
    setModal((previousInfo) => ({
      content: content,
      properties: {
          title:  title,
          buttonLabel
      },
      onModalClosed,
      ...previousInfo,
      modalAction
    })
  );

  const closeModal = () => setModal(null);

  const showErrorModal = () => showSimpleModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, (
    <div>There has been an error creating your quote. Please try again later or contact your sales representative.</div>
  ));

  const showCannotCreateQuoteForDeal = () => showSimpleModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, (
    <div>{modalConfig?.cannotCreateQuoteForDeal}</div>
  ));

  const onGridUpdate = (data, didQuantitiesChange) => {
      let subTotal = 0.00;
      let totalQuoteValue = data.reduce((totalQuoteValue, { unitListPrice, quantity, children }) => {
          if (quantity > 0)
              subTotal = Number(subTotal) + Number(quantity * unitListPrice);

          totalQuoteValue = children.reduce((totalQuoteValue, { unitListPrice, quantity }) => {
              if (quantity > 0)
                  subTotal = Number(subTotal) + Number(quantity * unitListPrice);
          }, 0);
      }, 0);

      subTotal = Math.round((subTotal + Number.EPSILON) * 100) / 100;

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
   * 
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
      if (buyMethodParam !== '' ){
        // 	SHOW system selection popup only if Reseller has SAP 6.8 account
        quoteDetails.buyMethod = buyMethodParam;
      }

      const result = await usPost(componentProp.quickQuoteEndpoint, {quoteDetails});
      if (!result.data?.error?.isError && result.data?.content?.confirmationId) {
        const { confirmationId } = result.data.content;
        showSimpleModal('Quote Submitted Successfully', (
          <div>Your quote is being created and will be available for your viewing in a few minutes. Quote Confirmation ID: {confirmationId}</div>
        ), closeModal, "Track My Quote", () => window.location.href = URL_QUOTES_GRID);
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
    if (showPopUp) {
      showSimpleModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, (
        <ModalQuoteCreateModal
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
    if (cannotCreateQuote(quote)) {
      showCannotCreateQuoteForDeal();
    } else if(pricingRequired || dealRequired || userMissingFields) {
      scrollToTopError();

      setQuoteWithoutEndUser(userMissingFields);
      setQuoteWithoutDealPricing(pricingRequired);
      setQuoteWithoutDeal(dealRequired);
    } else {
        validateCreateQuoteSystem(quote);
    }
  };

const [flagDeal, setFlagDeal] = useState(false);

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
  };

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

  const endUserInfoChange = (endUserlInformation) => {
    setQuoteWithoutEndUser(false);
    setQuoteDetails((previousQuoteDetails) => (
      {
        ...previousQuoteDetails,
        endUser: [endUserlInformation],
      }
    ));
  };

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
            flagDeal={flagDeal}
          />
          {
            componentProp.note.enableNoteSection === 'true' &&
              (<div className="cmp-quote-preview__note">
                <QuotePreviewNote note={componentProp.note} />
              </div>
          )}
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
