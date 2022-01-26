import React, { useState } from "react";
import Button from "../Widgets/Button";
import Link from "../Widgets/Link";
import { pushEvent } from "../../../../utils/dataLayerUtils";

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
  apiResponse
}) {
  const [isDefault, setIsDefault] = useState(false);

  const handleInputChange = () => {
    setIsDefault(!isDefault);
  };
  const dataToPush = (quotePreviewFields) => {
    return {
      eventInfo: "quoteComplete",
      clickInfo: {
        quotePreview: {
          quoteConfig: isConfig,
          ...quotePreviewFields,
        },
      },
      quotes: {
        quoteID: apiResponse?.content?.quoteDetails?.configurationId
      }
    };
  };

  const clickHandler = (evtName) => {
    if (evtName === eventTypes.button) {
      handleQuickQuote();
      pushEvent({ ...dataToPush({ quickQuote: "1" }) });
    } else if (evtName === eventTypes.link) {
      handleQuickQuoteWithoutDeals();
      pushEvent({ ...dataToPush({ standardPrice: "1" }) });
    }
  };

  return (
    <div className="cmp-qp-continue">
      <Button
        btnClass={"cmp-quote-button cmp-qp-continue__btn"}
        disabled={disableQuickQuoteButton}
        onClick={() => clickHandler(eventTypes.button)}
      >
        {gridProps.confirmButtonLabel}
      </Button>
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
    </div>
  );
}

export default QuotePreviewContinue;
