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
    uiServiceEndPointExcel,
    logoURL,
    fileName,
    downloadLinkText,
    quoteOptions,
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

  function onQuoteCheckout() {}

  function onOptionChanged(option) {
    option?.key !== "whiteLabelQuote"
      ? setExportOption(option)
      : setQuoteOption(option);
  }

  async function exportToCSV() {
    // call API to get CSV according to actual data
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
        "logo": "iVBORw0KGgoAAAANSUhEUgAAAPcAAABUBAMAAACsKrwgAAAAIVBMVEUAAABfXF3RGRndU1OQjo+zsrLoi4vLysr0xcXv6uokICFeYJN5AAAAAXRSTlMAQObYZgAAA2tJREFUeF7tl79r20AUx1+o41qeZGgx0RRkKMlmLCh0cyBdNDnQKVNJQbM6hWgKHUqzuS001JMENsb3V/beu59KbCnFqQX1fQb53fmcd3rfy/dJ8G9xOBwOh6Pz7QF3sDt+hA8YwO74mjxkujeSNyU6Sd6c6L+SZD9F91DkpkR/Ea5h0JTkxF5KTtw1JDnxBnZBO1kPSBzXnBsPr+h+LynAS8qH9+I7jQr5fOpdV1Q9rOcEszFOQdcxAMwwuMdL3we45J/zQ0bY4XfG8qxYbk5+VTpmicHMDgHggCGAFx8AYszRwtF5DhDwzyWtIBYqnPHFfXZRcdoji3eg8czsrbpVNsU0OYCHgxXluFhSchoRJiwyXqacHcC2BAyZxHiPAFRXn3LM5kD1yLsMscM5X52+7p1tK7nHiDGquwDoUhlmlLwQ58HPGGKHy4AxyHpHsIFOkow2iP5JzR0DQMv6s3NxwgrAQXHJxJfjmCF2uMJFcA0V/KwT/SNJbgpayBMGsSjthMqfCmHssE8b3Z7YPkqizjkEorRjEgHEnEAqAZV0wnrI5ZlgQRVOaQsTkKX1sSyFV0rXEisqaUeckuhvH4l+CgCHJfuYkAjgydKujMec9zipsgUMLOpFH1qiG8mpsMbiAswmdvSKlyPWNbnAC6gfwPNA5zrQFkf1FqU949swHkMCAIeCZ5I8YHiD2uKEvJQu40mMscj/ROn2NcmjBCmJPogMpa6SZ9riAtyGKO2BbSyF8CBOLIN6voQWx3Zh7K4yybTFxVRTStcyxqIEAI4OtmdG/THQFndJBk/pPNtYTPOkUkEVXljPgO6DMhqLw1YpDwIwwTT4S4/pRJKS6JFhZHWVlWVxXTIQGivvozVFD+lLXxjD34s+LO1uqOyqb1ncZ8bklnLIlAFoVspjnlFyy+I+sIUubVfMt5jGl8mhkvAJACcmna07fM9WIBsp5aGHKI2vPKZeciLcJLruKsuzXk83ryM21qU9VL1WMwGQZrOd6G3dVXzchLG4qXqaIemps2lS4zHb01XtMdAW11N+T7PCfDRP8phRWM8U8JWAo94bpji6+W1N38tpjVyZQhWRRdjk6+JVuJZT+D+pf36/hV3gbeoqzYl+AntAO1rDLeyGTlOSE6N9lJxoV0jehOhTeITD4XA4HA7HHzVqrIoKbpd4AAAAAElFTkSuQmCC"
      };
      const sessionId = localStorage.getItem("sessionId");
      const params = {
        method: 'POST',
        url: `${uiServiceEndPointExcel}`,
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-us',
          'Site': 'NA',
          'Consumer': 'NA',
          'TraceId': '35345345-Browse',
          'SessionId': sessionId,
          'Content-Type': 'application/json',
        },
        body: postData,
        responseType: 'blob',
      };
      // API call and see loader.
      const response = await usPost(`${uiServiceEndPointExcel}`, postData, params);
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(response.data);
      link.download = `quotes.xlsx`;

      link.click();
      link.remove();
    } catch (error) {
        console.error("error", error);
    }
  }

  const handleUploadFileSelected = (whiteLabelLogo) => {
    downloadClicked(quoteDetails, true, logoURL, fileName, downloadLinkText, whiteLabelLogo);
  }

  function exportToPDF(data) {
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
    exportOption?.key === "exportToCSV" && exportToCSV();
    exportOption?.key === "exportToPDF" && exportToPDF(data);
    downloadClicked(
        quoteDetails,
        true,
        logoURL,
        fileName,
        downloadLinkText
    );
  }, [exportOption, quoteDetails, actualQuoteLinesData]);

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
