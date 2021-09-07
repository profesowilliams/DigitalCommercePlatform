import React, { useEffect, useState } from "react";
import QuotesSubHeader from "./QuoteDetailsSubHeader/QuotesSubHeader";
import QuoteContactInfo from "./QuoteDetailsContactInfo/QuoteContactInfo";
import QuoteSubtotal from "./QuoteDetailsSubTotal/QuoteSubtotal";
import ProductLinesGrid from "./ProductLines/ProductLinesGrid";
import QuoteCheckout from "./QuoteDetailsCheckout/QuoteCheckout";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import PDFWindow from "../PDFWindow/PDFWindow";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";

const QuoteDetails = ({ componentProp }) => {
  const {
    subheaderLabel,
    subheaderTitle,
    resellerContactLabel,
    endUserContactLabel,
    subtotalLabel,
    uiServiceEndPoint,
    logoURL,
    fileName,
  } = JSON.parse(componentProp);

  const { id } = getUrlParams();
  const [response, isLoading] = useGet(
    `${uiServiceEndPoint}?id=${id}
    }`
  );
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [quoteOption, setQuoteOption] = useState(null);

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
      />
      <QuotesSubHeader label={subheaderLabel} title={subheaderTitle} quoteDetails={quoteDetails}  />
      <QuoteContactInfo
        label={resellerContactLabel}
        contact={quoteDetails.reseller}
      />
      <QuoteContactInfo
        label={endUserContactLabel}
        contact={quoteDetails.endUser}
      />
      <ProductLinesGrid
        gridProps={componentProp.productLines}
        data={quoteDetails}
        quoteOption={quoteOption}
      ></ProductLinesGrid>
      <QuoteSubtotal
        label={subtotalLabel}
        amount={quoteDetails.subTotalFormatted}
        currencySymbol={quoteDetails.currencySymbol}
      />
      <QuoteCheckout
        onQuoteCheckout={onQuoteCheckout}
        onQuoteOptionChanged={onOptionChanged}
      />
    </>
  ) : (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};

export default QuoteDetails;
