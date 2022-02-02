import React, { useEffect, useState } from "react";
import QuotesSubHeader from "./QuoteDetailsSubHeader/QuotesSubHeader";
import QuoteContactInfo from "./QuoteDetailsContactInfo/QuoteContactInfo";
import QuoteSubtotal from "./QuoteDetailsSubTotal/QuoteSubtotal";
import ProductLinesGrid from "./ProductLines/ProductLinesGrid";
import QuoteDetailsCheckout from "./QuoteDetailsCheckout/QuoteDetailsCheckout";
import WhiteLabelQuoteHeader from "./WhiteLabelQuoteHeader/WhiteLabelQuoteHeader";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";
import { downloadClicked } from "../PDFWindow/PDFWindow";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import GeneralInfo from "../common/quotes/GeneralInfo";
import { redirectToCart } from "../QuotesGrid/Checkout";
import Modal from '../Modal/Modal';
import { generateExcelFileFromPost } from "../../../../utils/utils";
import { pushEventAnalyticsGlobal } from "../../../../utils/dataLayerUtils";
import {
  ADOBE_DATA_LAYER_QUOTE_EXPORT_EVENT,
  ADOBE_DATA_LAYER_QUOTE_PAGE_VIEW_EVENT,
  ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY,
  ADOBE_DATA_LAYER_QUOTE_CHECKOUT_NAME,
  ADOBE_DATA_LAYER_QUOTE_CHECKOUT_TYPE,
  ADOBE_DATA_LAYER_CLICK_EVENT,
} from "../../../../utils/constants";

const QuoteDetails = ({ componentProp }) => {
  const {
    createdDateLabel,
    expiresDateLabel,
    subheaderLabel,
    subheaderTitle,
    subtotalLabel,
    information,
    productLines,
    endUseproductLines,
    uiServiceEndPoint,
    uiServiceEndPointExcel,
    agGridLicenseKey,
    logoURL,
    fileName,
    downloadLinkText,
    quoteOptions,
    checkout,
    whiteLabel,
    quoteNotFoundMessage,
    shopDomainPage
  } = JSON.parse(componentProp);
  const { id } = getUrlParams();
  const [response, isLoading, error] = useGet(`${uiServiceEndPoint}?id=${id}`);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [quoteOption, setQuoteOption] = useState(null);
  const [exportOption, setExportOption] = useState(null);
  const [quoteWithMarkup, setQuoteWithMarkup] = useState(null);
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [actualQuoteLinesData, setActualQuoteLinesData] = useState(null);
  const [whiteLabelOptions, setWhiteLabelOptions] = useState(null);
  const [whiteLabelLogoUpload, setWhiteLabelLogoUpload] = useState(null);
  const [ancillaryItems, setAncillaryItems] = useState(null);
  const [modal, setModal] = useState(null);
  productLines.agGridLicenseKey = agGridLicenseKey;
  const [analyticsProduct, setAnalyticsProduct] = useState([]);
  const [flagAnalytic, setFlagAnalytic] = useState(true);

  const handlerAnalyticExportEvent = (exportTypeParam) => {
    const quoteDetails = {
      quoteID : id,
      exportType: exportTypeParam,
    }
    const objectToSend = {
      quoteDetails,
      event: ADOBE_DATA_LAYER_QUOTE_EXPORT_EVENT
    };
    pushEventAnalyticsGlobal(objectToSend);
  }

  const getPopulateProdutcsToAnalytics = (quoteDetailsParam) => {
    const productsToSend = quoteDetailsParam.items.map(item => {
      return {
        productInfo: {
          parentSKU : item.tdNumber,
          name: item.displayName
        }
      }
    });
    setAnalyticsProduct(productsToSend);
  }

  const handlerAnalyticCheckoutEvent = () => {
    const objectToSend = {
      event: ADOBE_DATA_LAYER_CLICK_EVENT,
      clickInfo: {
        type: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_TYPE,
        name: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_NAME,
        category: ADOBE_DATA_LAYER_QUOTE_CHECKOUT_CATEGORY
      },
      products: analyticsProduct
    }
    pushEventAnalyticsGlobal(objectToSend)
  };

  const handlerAnalyticPageView = () => {
    const objectToSend = {
      event: ADOBE_DATA_LAYER_QUOTE_PAGE_VIEW_EVENT,
      quotes: {
        quoteID : id,
      },
      products: analyticsProduct
    }
    pushEventAnalyticsGlobal(objectToSend)
  }

  function onQuoteCheckout() {
    handlerAnalyticCheckoutEvent()
    redirectToCart(quoteDetails.checkoutSystem, id, checkout, onErrorHandler);
  }

  const onErrorHandler = (error) => {
    setModal((previousInfo) => (
        {
          content: (
            <div>There has been an error creating your quote. Please try again later or contact your sales representative.</div>
          ),
          properties: {
              title: `Error`,
          },
            ...previousInfo,
        }
    ));
  }

  const downloadClickedEvent = (whiteLabelLogo = null, ancillaryItemsProps = null) => {
    handlerAnalyticExportEvent('PDF')
    downloadClicked(quoteDetails,
      true,
      logoURL,
      fileName,
      downloadLinkText,
      whiteLabelLogo ? whiteLabelLogo : whiteLabelLogoUpload,
      whiteLabelOptions,
      ancillaryItemsProps ? ancillaryItemsProps : ancillaryItems,
      checkboxItems,
    );
  }

  function onOptionChanged(option) {
      if (option?.key !== "whiteLabelQuote") {
        setExportOption(option);
      } else {
        setQuoteOption(option);
      }
  }

  async function exportToCSV() {
    handlerAnalyticExportEvent('CSV')
    // call API to get CSV according to actual data
    let extraOptions = {
      resellerLogo: false,
      manufacturer: false,
      vendorPartNo: false,
      msrp: false
    };
    whiteLabelOptions !== null && whiteLabelOptions.forEach(e => {
      if (e === 'Part number- Tech data') {
        extraOptions.manufacturer = true;
      }

      if (e === 'MSRP/List price ') {
          extraOptions.vendorPartNo = true;
      }

      if (e === 'Part number- manufacturer') {
          extraOptions.msrp = true;
      }
      if (e === "The reseller logo") {
        extraOptions.resellerLogo = true;
    }
    })
    try {
      const postData = {
        "quoteId": id,
        "lineMarkup": [
            {
                "id": "100",
                "markupValue": 20.00
            },
            {
                "id": "200",
                "markupValue": 30.00
            }
        ],
        ...extraOptions,
        "logo": extraOptions.resellerLogo && whiteLabelLogoUpload ? whiteLabelLogoUpload : null
      };
      generateExcelFileFromPost({url:uiServiceEndPointExcel,name:'quotes.xlsx',postData})

    } catch (error) {
        console.error("error", error);
    }
  }

  const handleUploadFileSelected = (whiteLabelLogo) => {
    setWhiteLabelLogoUpload(whiteLabelLogo)
  }

  function exportToPDF() {
    downloadClickedEvent()
  }

  const [checkboxItems, setCheckboxItems] = useState(null);

  useEffect(() => {
    if (whiteLabel?.checkboxItems && checkboxItems === null) {
      setCheckboxItems(whiteLabel.checkboxItems);
    }
  }, [whiteLabel]);

  useEffect(() => {
    if (whiteLabel?.checkboxItems && checkboxItems === null) {
      setCheckboxItems(whiteLabel.checkboxItems);
    }
  }, [whiteLabel]);

  useEffect(() => {
    if (analyticsProduct?.length > 0 && flagAnalytic) {
      setFlagAnalytic(false)
      handlerAnalyticPageView()
    }
  }, [analyticsProduct])

  useEffect(() => {
    response?.content?.details && setQuoteDetails(response.content.details);
    response?.content?.details && getPopulateProdutcsToAnalytics(response.content.details);
    if(!isLoading && error == null  && !response?.content?.details)
    {
      setModal((previousInfo) => (
        {
          content: (
            <div>{quoteNotFoundMessage}</div>
          ),
          properties: {
              title: `Quote Details`,
          },
            ...previousInfo,
          }
      ));
    }
    else {
      setModal(null);
    }
  }, [response, error, isLoading]);

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote" ? true : false);
  }, [quoteOption]);

  useEffect(() => {
    /*actualQuoteLinesData : {
      quotes: Array -> contains data that represents actual state of quotes, regarding to applied markup etc;
      summary: {
        ancillaryItems : {total : -> sum of all ancillary AncillaryItems,
                          items: Array -> {description: description of item, value: actual value} }
        endUserSavings: difference between msrp and endUserTotal,
        endUserTotal: sum of the end user cost,
        msrp: sum of msrp of all items in quote,
        subtotal: subtotal value from api call (not calculated),
        yourCost: sum of your cost for all items in quote,
        yourMarkup: sum of your markup for all items in quote,
        // for calculation logic check markupReducer function in QuoteSubtotal component
      }
    }
    */
    const data = {
      quoteDetails: quoteDetails,
      actualQuoteLinesData: actualQuoteLinesData,
    };
      data?.actualQuoteLinesData?.ancillaryItems?.items && setAncillaryItems(data.actualQuoteLinesData.ancillaryItems.items)
      exportOption?.key === "exportToCSV" && exportToCSV();
      exportOption?.key === "exportToPDF" && exportToPDF();
      setExportOption(null)
  }, [exportOption, quoteDetails, actualQuoteLinesData]);

  useEffect(() => {
    actualQuoteLinesData?.ancillaryItems?.items && setAncillaryItems(actualQuoteLinesData.ancillaryItems.items)
  }, [actualQuoteLinesData]);

  const getSourceInformation = (attributes, type) =>
    attributes?.find((attribute) => attribute.type.toLowerCase() === type.toLowerCase());

  const getAttributeInformation = (attributes, name) =>
    attributes?.find((attribute) => attribute.name.toUpperCase() === name);

  const getSource = (quoteDetails) => {
    const vendorQuoteSource = getSourceInformation(quoteDetails.source, 'Vendor Quote');
    const estimateIdSource = getSourceInformation(quoteDetails.source, 'Estimate Id');

    let source = vendorQuoteSource?.value || estimateIdSource?.value
                ? []
                : null;

    if (vendorQuoteSource?.value) {
      source.push({
        type: vendorQuoteSource?.type,
        value: vendorQuoteSource?.value
      });
    }

    if (estimateIdSource?.value) {
      source.push({
        type: estimateIdSource?.type,
        value: estimateIdSource?.value
      });
    }

    return source;
  }

  const getDeal = (quoteDetails) => {
    const dealSource = getSourceInformation(quoteDetails.source, 'Deal');
    const vendorAttribute = getAttributeInformation(quoteDetails.attributes, 'VENDOR');

    let deal = null;

    if (dealSource?.value || vendorAttribute?.value) {
      deal = {
        spaId: dealSource?.value,
        vendor: vendorAttribute?.value,
      }
    }

    return deal;
  }

  const getGeneralInformationData = (quoteDetails) => {

    let generalInformationData = {
      ...quoteDetails
    }

    generalInformationData.deal = getDeal(quoteDetails);
    generalInformationData.source = getSource(quoteDetails);

    return generalInformationData;
  }

  const renderHeader = () => {
    return whiteLabelMode
          ? ( <WhiteLabelQuoteHeader componentProp={componentProp} logoUploadHandler={handleUploadFileSelected} setWhiteLabelOptions={setWhiteLabelOptions} /> )
          : (
            <>
              <QuoteContactInfo
                label={
                  information?.yourCompanyHeaderLabel
                    ? information?.yourCompanyHeaderLabel
                    : ""
                }
                contact={quoteDetails?.reseller}
              />
            <QuoteContactInfo
              label={
                information?.endUserHeaderLabel ? information.endUserHeaderLabel : ""
              }
              contact={quoteDetails?.endUser}
            />
            <GeneralInfo
                quoteDetails={getGeneralInformationData(quoteDetails)}
                gridProps={quoteDetails}
                info={information}
                readOnly={true}
            />
          </>
        );
  }

  const renderQuoteDetails = () => {
    return (
      <>
        <QuotesSubHeader
          label={subheaderLabel}
          title={subheaderTitle}
          quoteDetails={quoteDetails}
          dateLabels={{ createdDateLabel, expiresDateLabel }}
        />
        {renderHeader()}
        <ProductLinesGrid
          gridProps={productLines}
          labels={whiteLabel}
          data={quoteDetails}
          quoteOption={quoteOption}
          quoteDetailColumns={productLines?.columnList}
          whiteLabelColumns={whiteLabel?.columnList}
          shopDomainPage={shopDomainPage}
          onMarkupChanged={(quote) => {
            setQuoteWithMarkup([...quote]);
          }}
        />
        <QuoteSubtotal
          labels={whiteLabel}
          amount={quoteDetails?.subTotal}
          currencySymbol={
            quoteDetails?.currencySymbol ? quoteDetails?.currencySymbol : ""
          }
          quoteWithMarkup={quoteWithMarkup}
          quoteOption={quoteOption}
          onMarkupChanged={(data) => setActualQuoteLinesData(data)}
        />
        <QuoteDetailsCheckout
          labels={quoteOptions}
          onQuoteCheckout={onQuoteCheckout}
          onQuoteOptionChanged={onOptionChanged}
          quoteDetails={quoteDetails}
        />
      </>
    )
  }

  return (
    <div className="cmp-quote-details">
      {quoteDetails ? renderQuoteDetails() : error ?
      <ErrorMessage
          error={error}
          messageObject={{"message401" : "You need to be logged in to view this"}}
      /> : (
        <FullScreenLoader>
          <Loader visible={true} />
        </FullScreenLoader>
      )}
      {modal && <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
      ></Modal>}
    </div>
  );
};

export default QuoteDetails;
