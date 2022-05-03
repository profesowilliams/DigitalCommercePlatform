import React, { useState } from "react";
import Button from "../Widgets/Button";
import Link from "../Widgets/Link";
import { isDealConfiguration } from "../QuotePreview/QuoteTools";
import { ANALYTICS_TYPES, pushEvent } from "../../../../utils/dataLayerUtils";

const eventTypes = {
  button: "button",
  link: "link",
};

function QuotePreviewContinue({
  gridProps,
  disableQuickQuoteButton,
  handleQuickQuote,
  handleQuickQuoteWithoutDeals,
  isConfig,
  apiResponse,
}) {
  const [isDefault, setIsDefault] = useState(false);
  const handleInputChange = () => {
    setIsDefault(!isDefault);
  };

  const dataToPush = (quotePreviewFields) => (
    ANALYTICS_TYPES.events.quoteComplete,
    null,
    {
      quotePreview: {
        quoteConfig: isConfig,
        ...quotePreviewFields,
      },
      quotes: {
        quoteID: "",
      },
    }
  );
  

  const quoteDetailsSource = apiResponse?.content?.quotePreview?.quoteDetails?.source;
  const quoteDetails = apiResponse?.content?.quotePreview?.quoteDetails;

  const clickHandler = (evtName) => {
    if (evtName === eventTypes.button) {
      handleQuickQuote();
      pushEvent("quoteComplete", dataToPush({ quickQuote: "1" }))
    } else if (evtName === eventTypes.link) {
      handleQuickQuoteWithoutDeals();
      pushEvent("quoteComplete", dataToPush({ standardPrice: "1" }))
    }
  };

  return (
    <div className="cmp-qp-continue">
      <Button
        btnClass={"cmp-quote-button cmp-qp-continue__btn"}
        disabled={disableQuickQuoteButton}
        onClick={() => clickHandler(eventTypes.button)}
      >
        {quoteDetails?.quickQuoteWithVendorFlag ? gridProps.alternateConfirmButtonLabel : gridProps.confirmButtonLabel} 
      </Button>
      {/* Only render the "Continue With Standard Price" Link when the quote is not of type Deal. */}
      {!isDealConfiguration(quoteDetailsSource) && (
        <>
          <div className="cmp-qp-continue__checkbox">
            <input
              type="checkbox"
              name="make-default"
              checked={isDefault}
              onChange={handleInputChange}
            />
            <label htmlFor="make-default">{gridProps.defaultChoiceLabel}</label>
          </div>
          <Link
            callback={() => clickHandler(eventTypes.link)}
            variant={"cmp-qp-continue__link"}
            underline={"always"}
            >
            {gridProps.continueWithStandardPriceLabel}
          </Link>
        </>
      )}
      
    </div>
  );
}

export default QuotePreviewContinue;
