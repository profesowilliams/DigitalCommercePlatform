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
import {Buffer} from 'buffer'
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
    const bufferArrya = await getExcel();
    const response_ = getExcelSource(bufferArrya);
    downloadBase64File('.xls', response_, 'quotes.xls');
  }

  const downloadBase64File = (contentType, base64Data, fileName) => {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
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

  const getExcelSource = (param) => {
    const buff = Buffer.from(param, "base64");
    return buff.toString('base64');
  };

  useEffect(() => {
    response?.content?.details && setQuoteDetails(response.content.details);
    
  }, [response]);

  const getExcel = async () => {
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
    };
    try {
      // API call and see loader.
      const result = await usPost(`${uiServiceEndPointExcel}`, postData, params);
      return result.data;
    } catch( error ) {
      console.log('Error', error)
    }
  } 

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
