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
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { isExtraReloadDisabled } from "../../../../utils/featureFlagUtils";
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
import { ANALYTICS_TYPES, pushEvent } from '../../../../utils/dataLayerUtils';
import { 
  LOCAL_STORAGE_KEY_USER_DATA,
  QUOTE_PREVIEW_AVT_TYPE_VALUE,
  QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE,
  QUOTE_PREVIEW_CREATE_POPUP_ACTION,
  QUOTE_PREVIEW_TECH_DATA,
  QUOTE_PREVIEW_AVT_TECHNOLOGY,
  QUOTE_PREVIEW_TECH_DATA_CUSTOMER_METHOD,
  QUOTE_PREVIEW_AVT_TECHNOLOGY_CUSTOMER_METHOD,
  QUOTE_PREVIEW_BROADCAST_CHANNEL_ID,
} from "../../../../utils/constants";
import { isNotEmptyValue } from "../../../../utils/utils";
import {useStore} from "../../../../utils/useStore"
import useAuth from "../../hooks/useAuth";

function QuotePreview(props) {
  const componentProp = JSON.parse(props.componentProp);
  const URL_QUOTES_GRID = componentProp.successRedirectPage ? componentProp.successRedirectPage : '#';
  const { id, type, vendor = 'cisco', sourceIsConfigsGrid = false } = getUrlParams();
  const [apiResponse, isLoading, error] = useGet(componentProp.uiServiceEndPoint.replace('{configuration-id}', id).replace('{type}', type).replace('{vendor}', vendor));
  const currencySymbol = apiResponse?.content?.quotePreview?.quoteDetails.currencySymbol || '$';
  const [quoteDetails, setQuoteDetails] = useState({});
  const [loadingCreateQuote, setLoadingCreateQuote] = useState(false);
  const [didQuantitiesChange, setDidQuantitiesChange] = useState(false);
  const [quoteWithoutPricing, setQuoteWithoutDealPricing] = useState(false);
  const [quoteWithoutDeal, setQuoteWithoutDeal] = useState(false);
  const [isQuoteWithoutEndUser, setQuoteWithoutEndUser] = useState(true);
  const [modal, setModal] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [tier, setTier] = useState('');
  const modalConfig = componentProp?.modalConfig;
  const DEAL_ATTRIBUTE_FIELDNAME = "DEALIDENTIFIER";

  const {isUserLoggedIn:isLoggedIn} = useAuth();

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;
  const channel = new BroadcastChannel(QUOTE_PREVIEW_BROADCAST_CHANNEL_ID);
  channel.postMessage(id);
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

  const [flagMesssageBoxRequiredFields, setflagMesssageBoxRequiredFields] = useState(false);

  const validateItem = (item) => {
    if (item.attachmentRequired || item.setupReuired) {
      setflagMesssageBoxRequiredFields(true);
      return true;
    } else
      return false
  }

  /**
   * handler that validate if the response have one field with the specified field
   * * attachmentRequired
   * * setupReuired
   * @param {any[]} quoteDetailsParam 
   */
  const handlerBoxShowRequiredField = (quoteDetailsParam) => {
    const items = quoteDetailsParam?.items;
    items.forEach(item => {
      if (validateItem(item)) 
        return
      const childItems = item.children.length > 0 ? item.children : null;
      isNotEmptyValue(childItems) && childItems.forEach(chilItem => {
        if (validateItem(chilItem)) 
        return
      });
    });
  };

  /**
   * Getting the values of the Quote
   */
  useEffect(() => { 
    const quoteDetailsResponse = apiResponse?.content?.quotePreview?.quoteDetails;
    if(isLoggedIn){
      if(quoteDetailsResponse) {
        handlerBoxShowRequiredField(quoteDetailsResponse);
        const customerBuyMethod =  quoteDetailsResponse.customerBuyMethod;
        const distiBuyMethodParam = isNotEmptyValue(quoteDetailsResponse.distiBuyMethod) ? quoteDetailsResponse.distiBuyMethod : '';
        // Remove Choose Modal 
        setShowPopUp(isTechDataAndAVTTechCustomerMethod(customerBuyMethod)); // Flag to know if need to show the popup
        setTier(isNotEmptyValue(quoteDetailsResponse.tier) ? quoteDetailsResponse.tier : '');
        // set buy Method to “sap46” or set buy Method to “tdavnet67” in some specific cases
        quoteDetailsResponse.buyMethod = setQuoteDetailsEffect(distiBuyMethodParam, customerBuyMethod, quoteDetailsResponse.buyMethod);
        //Set to false until quick quote is selected
        quoteDetailsResponse.quickQuoteWithVendorFlag = quoteDetailsResponse?.source?.type === "Estimate" && quoteDetailsResponse?.vendor.toUpperCase() === "CISCO" && !quoteDetailsResponse?.spaId;;
        setQuoteDetails(quoteDetailsResponse);
        // Show Modal When Quote Cannot Be Created.
        if (cannotCreateQuote(quoteDetailsResponse)) {
          showErrorModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, modalConfig?.cannotCreateQuoteForDeal);
        }
        setFlagDeal(!isDealConfiguration(quoteDetailsResponse.source));
      } else if(apiResponse?.error?.isError) {// 200 Ok isError=true
        showErrorModal(modalConfig?.errorLoadingPageTitle, getErrorMessage(apiResponse.error?.code), 
          () => window.location.href = modalConfig?.errorLoadingPageRedirect); 
      }
    }
  }, [apiResponse, isExtraReloadDisabled(), isLoggedIn]);

  /**
   * Handle unexpected useGet error
   */
   useEffect(() => { 
    if(!error?.code === 401) {
      showErrorModal(modalConfig?.errorLoadingPageTitle, modalConfig?.errorGenericMessage, 
        () => window.location.href = modalConfig?.errorLoadingPageRedirect); 
    }     
   }, [error]);

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
    
  const getErrorMessage = (errorCode) => {
    if(errorCode === 404) {
      return modalConfig?.error404Message;
    } else if(errorCode === 428) {
      return modalConfig?.error428Message;
    }
    return modalConfig?.errorGenericMessage;
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

  const showErrorModal = (title, message, redirectPage) =>
    showSimpleModal(title, <div>{message}</div>, redirectPage || undefined);

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
        quoteDetails.reseller[0] = { ...quoteDetails.reseller[0], id: number, companyName: name }
      }
      if (buyMethodParam !== '' ){
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
        showErrorModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, modalConfig?.cannotCreateQuoteGenericMessage);
      }

      return result.data;
    } catch( error ) {      
      showErrorModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, modalConfig?.cannotCreateQuoteGenericMessage);
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

  const showPopUpValidation = (isStandardPrincing) => {
    return showPopUp && flagDeal && isStandardPrincing
  };

  /**
   * Function that validate if the quote have the field
   * isExclusive true and show a modal to select the
   * SAP system and keep the logic
   * @param {any} quoteParam
   * @param {boolean} isStandardPrincing
   */
  const validateCreateQuoteSystem = (quoteParam, isStandardPrincing) => {
    if (showPopUpValidation(isStandardPrincing)) { 
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
    setQuoteDetails({
      ...quoteDetails,
      quickQuoteWithVendorFlag: quoteDetails?.source?.type === "Estimate" && quoteDetails?.vendor.toUpperCase() === "CISCO" && !quoteDetails?.spaId
    });
    const quoteDetailsCopy = { ...quoteDetails };
    quoteDetailsCopy.quickQuoteWithVendorFlag = quoteDetails?.source?.type === "Estimate" && quoteDetails?.vendor.toUpperCase() === "CISCO" && !quoteDetails?.spaId;
    const requiredFields = {
      pricingRequired: isPricingOptionsRequired(quoteDetailsCopy, true),
      dealRequired: isDealRequired(quoteDetailsCopy, true),
      userMissingFields: isEndUserMissing(quoteDetailsCopy, true)
    }
    tryCreateQuote(requiredFields, quoteDetails, false);
  }, [quoteDetails]);

  const handleStandardQuote = (e) => {
    setQuoteDetails({
      ...quoteDetails,
      quickQuoteWithVendorFlag: false
    });
    const quoteDetailsCopy = { ...quoteDetails };
    quoteDetailsCopy.quickQuoteWithVendorFlag = false;
    const requiredFields = {
      pricingRequired: isPricingOptionsRequired(quoteDetailsCopy, true),
      dealRequired: false,
      userMissingFields: isEndUserMissing(quoteDetailsCopy, true),
    };

    // remove deal if present 
    // RFH - I don't think we need to do this. This is only called by standard pricing. A SPA can not be selected and quoted using Quick Quote nor Standard Priing with this logic in place. Leaving commented to verify before removing. 
    //if (!isDealConfiguration(quoteDetails.source) && quoteDetailsCopy.hasOwnProperty("deal")) {
    //  delete quoteDetailsCopy.deal;

    //  quoteDetailsCopy.attributes = quoteDetailsCopy.attributes?.filter((attribute) => attribute.name.toUpperCase() !== DEAL_ATTRIBUTE_FIELDNAME);
    //}
    tryCreateQuote(requiredFields, quoteDetailsCopy, true);

  };

  const tryCreateQuote = (requiredFields, quote, isStandardPrincing) => {
    if (cannotCreateQuote(quote)) {
      showErrorModal(QUOTE_PREVIEW_CREATE_POPUP_ACTION, modalConfig?.cannotCreateQuoteForDeal);
    } else if(requiredFields.pricingRequired || requiredFields.dealRequired || requiredFields.userMissingFields) {
      scrollToTopError();

      setQuoteWithoutEndUser(requiredFields.userMissingFields);
      setQuoteWithoutDealPricing(requiredFields.pricingRequired);
      setQuoteWithoutDeal(requiredFields.dealRequired);
    } else {
        validateCreateQuoteSystem(quote, isStandardPrincing);
    }
  };

  const [flagDeal, setFlagDeal] = useState(false);

  const generalInfoChange = (generalInformation) =>{
    setQuoteDetails((previousQuoteDetails) => {
      setDealApplyAnalytics(generalInformation);
      let originalSpaId = previousQuoteDetails.spaId;
      let newGeneralDetails = {
        ...previousQuoteDetails,
        tier: generalInformation.tier,
        spaId: generalInformation.spaId,
        quoteReference: generalInformation.quoteReference,
        deal: generalInformation.deal,
        quickQuoteWithVendorFlag: generalInformation?.deal?.spaId ?
          previousQuoteDetails?.source?.type === "Estimate" && previousQuoteDetails?.vendor.toUpperCase() === "CISCO" && !generalInformation?.deal?.spaId :
          previousQuoteDetails.quickQuoteWithVendorFlag,
      };

      newGeneralDetails.endUser = newGeneralDetails.endUser || [];
      newGeneralDetails.endUser[0] = newGeneralDetails.endUser.length > 0 ?
        newGeneralDetails.endUser[0] ?
          newGeneralDetails.endUser[0] :
          {} :
        {};

      if (generalInformation.deal?.endUserName &&
        generalInformation.deal.endUserName.trim().length > 0) {
        newGeneralDetails.endUser[0].companyName = generalInformation.deal.endUserName;
        newGeneralDetails.endUser[0] = clearEndUserInfo(newGeneralDetails.endUser[0]);
      } else if (!generalInformation.endUserName && originalSpaId) {
        newGeneralDetails.endUser[0].companyName = generalInformation.endUserName;
        newGeneralDetails.endUser[0] = clearEndUserInfo(newGeneralDetails.endUser[0]);
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

  const clearEndUserInfo = (endUserInfo) => {
    const endUser = { ...endUserInfo };
    endUser.name = "";
    endUser.line1 = "";
    endUser.line2 = "";
    endUser.city = "";
    endUser.state = "";
    endUser.postalCode = "";
    endUser.country = "";
    endUser.email = "";
    endUser.phoneNumber = "";
    return endUser;
  };

  const setDealApplyAnalytics = (generalInfo) => {
    pushEvent(
      ANALYTICS_TYPES.events.qpDealApply,
      null,
      {
        quotePreview: {
          dealId: generalInfo.deal.dealId || "",
          genTier: generalInfo.tier || "",
        },
      }
    );
  };

  const endUserInfoChange = (endUserInformation) => {
    setQuoteWithoutEndUser(false);
    setQuoteDetails((previousQuoteDetails) => (
      {
        ...previousQuoteDetails,
        endUser: [endUserInformation],
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
          companyName: selectedCompanyInfo.companyName,
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
        {apiResponse && !isLoading ? (
        <section>
          <ConfigGrid
            hideDealSelector={isDealSelectorHidden(quoteDetails)}
            isDealRequired={isDealRequired(quoteDetails, quoteWithoutDeal)}
            isPricingOptionsRequired={isPricingOptionsRequired(quoteDetails, quoteWithoutPricing)}
            isEndUserMissing={isEndUserMissing(quoteDetails, isQuoteWithoutEndUser)}
            gridProps={componentProp}
            quoteDetails={quoteDetails}
            endUserInfoChange={endUserInfoChange}
            generalInfoChange={generalInfoChange}
            companyInfoChange={companyInfoChange}
            flagDeal={flagDeal}
          />
          {
            flagMesssageBoxRequiredFields === true &&
              (<div className="cmp-quote-preview__note">
                <QuotePreviewNote note={componentProp.note} />
              </div>
          )}
          <div className="cmp-quote-preview__lines">
            <QuotePreviewGrid
              isAllowedQuantityIncrease={isAllowedQuantityIncrease(quoteDetails)}
              gridProps={componentProp.productLines}
              shopDomainPage={componentProp.shopDomainPage}
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
            disableQuickQuoteButton={didQuantitiesChange}
            handleQuickQuote={handleQuickQuote}
            handleStandardQuote={handleStandardQuote}
            apiResponse={quoteDetails}
            isConfig={sourceIsConfigsGrid}
            />
        </section>
      ) : error &&
      <ErrorMessage
        error={error}
        messageObject={{"message401" : "You need to be logged in to view this"}}
      /> 
      }
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
