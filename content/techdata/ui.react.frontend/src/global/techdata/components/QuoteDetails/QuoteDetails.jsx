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
import { usPost } from "../../../../utils/api";
import { downloadClicked } from "../PDFWindow/PDFWindow";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import GeneralInfo from "../common/quotes/GeneralInfo";
import { redirectToCart } from "../QuotesGrid/Checkout";
import Modal from '../Modal/Modal';
import { generateExcelFileFromPost } from "../../../../utils/utils";

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
    logoURL,
    fileName,
    downloadLinkText,
    quoteOptions,
    checkout,
    whiteLabel,
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

  function onQuoteCheckout() {
    redirectToCart(id, checkout, onErrorHandler);
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
    downloadClicked(quoteDetails,
      true,
      logoURL,
      fileName,
      downloadLinkText,
      whiteLabelLogo ? whiteLabelLogo : whiteLabelLogoUpload,
      whiteLabelOptions,
      ancillaryItemsProps ? ancillaryItemsProps : ancillaryItems
    );
  }

  function onOptionChanged(option) {
      if (option?.key !== "whiteLabelQuote") {
        setExportOption(option);
        downloadClickedEvent()
      } else {
        downloadClickedEvent()
        setQuoteOption(option);
      }
  }

  async function exportToCSV() {
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
        "logo": extraOptions.resellerLogo && whiteLabelLogoUpload ? whiteLabelLogoUpload : logoURL
      };
      generateExcelFileFromPost({url:uiServiceEndPointExcel,name:'quotes.xlsx',postData})
     
    } catch (error) {
        console.error("error", error);
    }
  }

  const handleUploadFileSelected = (whiteLabelLogo) => {
    setWhiteLabelLogoUpload(whiteLabelLogo)
    downloadClickedEvent(whiteLabelLogo)
  }

  function exportToPDF() {
    downloadClickedEvent()
      let downloadLinkDivTag = document.getElementById("pdfDownloadLink");
      let downloadLinkATagCollection =
        downloadLinkDivTag.getElementsByTagName("a");
      let downloadLinkATag =
        downloadLinkATagCollection.length > 0
          ? downloadLinkATagCollection[0]
          : undefined;
      if (downloadLinkATag) {
        downloadLinkATag.click();
      }
  }

  useEffect(() => {
    if (whiteLabelOptions) {
      downloadClickedEvent();
    }
  },[whiteLabelOptions]);

  useEffect(() => {
    response?.content?.details && setQuoteDetails(response.content.details);

  }, [response]);

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
    actualQuoteLinesData?.ancillaryItems?.items && downloadClickedEvent(null, actualQuoteLinesData?.ancillaryItems?.items);
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

  return quoteDetails ? (
    <div className="cmp-quote-details">
      <QuotesSubHeader
        label={subheaderLabel}
        title={subheaderTitle}
        quoteDetails={quoteDetails}
        dateLabels={{ createdDateLabel, expiresDateLabel }}
      />
      {
        whiteLabelMode 
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
          )
      }
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
      ></ProductLinesGrid>
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
      {modal && <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
      ></Modal>}
    </div>
  ) : error ?
    <ErrorMessage
        error={error}
        messageObject={{"message401" : "You need to be logged in to view this"}}
    /> : (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};

export default QuoteDetails;
