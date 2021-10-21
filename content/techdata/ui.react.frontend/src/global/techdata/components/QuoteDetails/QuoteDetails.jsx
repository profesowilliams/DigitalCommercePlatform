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
import GeneralInfo from "../common/quotes/GeneralInfo"

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
    logoURL,
    fileName,
    downloadLinkText,
    quoteOptions,
    whiteLabel,
  } = JSON.parse(componentProp);

  const { id } = getUrlParams();
  const [response, isLoading, error] = useGet(`${uiServiceEndPoint}?id=${id}`);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [quoteOption, setQuoteOption] = useState(null);
  const [exportOption, setExportOption] = useState(null);
  const [quoteWithMarkup, setQuoteWithMarkup] = useState(null);
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [actualQuoteLinesData, setActualQuoteLinesData] = useState(null);

  function onQuoteCheckout() {}

  function onOptionChanged(option) {
    option?.key !== "whiteLabelQuote"
      ? setExportOption(option)
      : setQuoteOption(option);
  }

  function exportToCSV(data) {
    // call API to get CSV according to actual data
  }

  const handleUploadFileSelected = (whiteLabelLogo) => {
    downloadClicked(quoteDetails, true, logoURL, fileName, downloadLinkText, whiteLabelLogo);
  }

  function exportToPDF(data) {
    downloadClicked(
      data.quoteDetails,
      true,
      logoURL,
      fileName,
      downloadLinkText
    );
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
    exportOption?.key === "exportToCSV" && exportToCSV(data);
    exportOption?.key === "exportToPDF" && exportToPDF(data);
  }, [exportOption, quoteDetails, actualQuoteLinesData]);

  const getAttributeInformation = (attributes, name) => 
    attributes?.find((attribute) => attribute.name.toUpperCase() === name);

  const getGeneralInformationData = (quoteDetails) => {
    const dealIdAttribute = getAttributeInformation(quoteDetails.attributes, 'DEALIDENTIFIER');
    const sourceAttribute = getAttributeInformation(quoteDetails.attributes, 'VENDORQUOTEID');
    const vendorAttribute = getAttributeInformation(quoteDetails.attributes, 'VENDOR');

    let generalInformationData = {
      ...quoteDetails
    }

    if (sourceAttribute?.value) {
      generalInformationData.source = {
        value: sourceAttribute?.value
      }
    }
    else {
      generalInformationData.source = null;
    }

    if (dealIdAttribute?.value || vendorAttribute?.value) {
      generalInformationData.deal = {
        spaId: dealIdAttribute?.value,
        vendor: vendorAttribute?.value,
      } 
    }

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
          ? ( <WhiteLabelQuoteHeader componentProp={componentProp} logoUploadHandler={handleUploadFileSelected} /> )
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
