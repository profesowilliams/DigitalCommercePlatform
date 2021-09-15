import React, { useEffect, useState } from "react";
import QuotesSubHeader from "./QuoteDetailsSubHeader/QuotesSubHeader";
import QuoteContactInfo from "./QuoteDetailsContactInfo/QuoteContactInfo";
import QuoteSubtotal from "./QuoteDetailsSubTotal/QuoteSubtotal";
import ProductLinesGrid from "./ProductLines/ProductLinesGrid";
import QuoteDetailsCheckout from "./QuoteDetailsCheckout/QuoteDetailsCheckout";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import PDFWindow from "../PDFWindow/PDFWindow";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";

const QuoteDetails = ({ componentProp }) => {
  const {
    createdLabel,
    expiresLabel,
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
    whiteLabel,
  } = JSON.parse(componentProp);

  const { id } = getUrlParams();
  const [response, isLoading, error] = useGet(`${uiServiceEndPoint}?id=${id}`);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [quoteOption, setQuoteOption] = useState(null);
  const [quoteWithMarkup, setQuoteWithMarkup] = useState(null);

  function onQuoteCheckout() {}

  function onOptionChanged(option) {
    setQuoteOption(option);
  }

  useEffect(() => {
    response?.content?.details && setQuoteDetails(response.content.details);
  }, [response]);

  return quoteDetails ? (
    <>
      <PDFWindow
        quoteDetails={quoteDetails}
        logoURL={logoURL}
        fileName={fileName}
        downloadLinkText={downloadLinkText}
      />
      <QuotesSubHeader
        label={subheaderLabel}
        title={subheaderTitle}
        quoteDetails={quoteDetails}
      />
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
      <ProductLinesGrid
        gridProps={productLines}
        data={quoteDetails}
        quoteOption={quoteOption}
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
      />
      <QuoteDetailsCheckout
        onQuoteCheckout={onQuoteCheckout}
        onQuoteOptionChanged={onOptionChanged}
      />
    </>
  ) : error ? (
    <div className="cmp-error">
      <div className="cmp-error__header">
        Error {error.code && error.code} {error.status && error.status}.
      </div>
      <div className="cmp-error__message">
        {" "}
        {error.code === 401 || error.status === 401
          ? "You have to be logged in to use this feature."
          : "Contact your site administrator."}
      </div>
    </div>
  ) : (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};

export default QuoteDetails;
